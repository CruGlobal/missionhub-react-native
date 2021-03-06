import { JsonApiDataStore } from 'jsonapi-datastore';

import { LOG, APILOG } from '../utils/logging';

import request from './utils';
import { REQUESTS, ApiRouteConfig } from './routes';

const VALID_METHODS = ['get', 'put', 'post', 'delete'];

// Setup API call
const API_CALLS: {
  [key: string]: (
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryParams: Record<string, string | unknown>,
    data: Record<string, unknown> | string | FormData,
  ) => Promise<{
    meta?: Record<string, unknown>;
    results?: Record<string, unknown>;
    response?: Record<string, unknown>;
    sessionHeader: string;
  }>;
} = Object.entries(REQUESTS as ApiRouteConfig).reduce(
  (acc, [key, routeData]) => ({
    ...acc,
    [key]: async (
      { access_token, ...q }: { access_token: string; [key: string]: string },
      data: Record<string, unknown> | string,
    ) => {
      const method = routeData.method || 'get';

      // Make sure the 'method' is one of the valid types
      if (!VALID_METHODS.includes(method)) {
        throw 'InvalidMethod';
      }

      // Merge the extra data with the access_token
      const authHeader = {
        ...(routeData.anonymous || !access_token
          ? {}
          : { Authorization: `Bearer ${access_token}` }),
      };

      const extra: RequestInit = {
        ...routeData.extra,
        headers: {
          ...authHeader,
          ...(routeData.extra ? routeData.extra.headers : {}),
        },
      };

      // Merge default includes from the routes with the query passed in
      const query: { [key: string]: string } = {
        ...(routeData.include ? { include: routeData.include } : {}),
        ...q,
      };

      let endpoint = routeData.endpoint;

      // Only do this for endpoints that have query parameters
      if (endpoint.includes('/:')) {
        // Replace all `:orgId` with the query param
        Object.keys(query).forEach(k => {
          if (query[k] && endpoint.includes(`:${k}`)) {
            endpoint = endpoint.replace(`:${k}`, query[k]);
            delete query[k];
          }
        });
      }

      // Call the request
      APILOG(`${key} FETCH`, method, endpoint, query, data);
      try {
        const { jsonResponse, sessionHeader } = await request(
          method,
          endpoint,
          query,
          method === 'get' ? undefined : data,
          extra,
          routeData.stringify,
        );
        APILOG(`${key} SUCCESS`, jsonResponse);
        if (!jsonResponse) {
          return { sessionHeader };
        }

        if (routeData.useJsonDataApiStore === false) {
          return { results: jsonResponse, meta: jsonResponse.meta };
        } else {
          const jsonApiStore = new JsonApiDataStore();
          const response = jsonApiStore.sync(jsonResponse);

          return {
            meta: jsonResponse.meta,
            results: jsonApiStore,
            response,
            sessionHeader,
          };
        }
      } catch (requestError) {
        LOG(
          'request error or error in logic that handles the request',
          key,
          requestError,
        );
        APILOG(`${key} FAIL`, requestError);

        throw { key, endpoint, method, query, apiError: requestError };
      }
    },
  }),
  {},
);

export default API_CALLS;
