import merge from 'lodash/merge';
import lodashForEach from 'lodash/forEach';
import { JsonApiDataStore } from 'jsonapi-datastore';

import { exists } from '../utils/common';
import { URL_ENCODED, URL_FORM_DATA } from '../constants';

import request from './utils';
import apiRoutes from './routes';

const VALID_METHODS = ['get', 'put', 'post', 'delete'];

// Setup API call
const API_CALLS = {};
lodashForEach(apiRoutes, (routeData, key) => {
  API_CALLS[key] = (q, d) =>
    new Promise((resolve, reject) => {
      const method = routeData.method || 'get';

      // Make sure the 'method' is one of the valid types
      if (!VALID_METHODS.includes(method)) {
        reject('InvalidMethod');
        return;
      }
      // Run a check to see if the data has all the correct info
      if (routeData.beforeCall) {
        const shouldContinueMsg = routeData.beforeCall(q, d);
        if (shouldContinueMsg !== true) {
          reject(shouldContinueMsg);
          return;
        }
      }

      // Merge the extra data with the access_token
      const authHeader = {};
      if (!routeData.anonymous) {
        authHeader['Authorization'] = `Bearer ${q.access_token}`;
      }
      delete q.access_token;
      const extra = merge({}, { headers: authHeader }, routeData.extra);

      // Merge some default data from the routes with the data passed in
      const data = dontMergeData(routeData) ? d : merge({}, routeData.data, d);
      const query = merge({}, routeData.query, q);

      // Get the endpoint either from the query, or the routeData
      let endpoint = query.endpoint || routeData.endpoint;
      //endpoint = endpoint + 'trouble';

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
      request(
        method,
        endpoint,
        query,
        method === 'get' ? undefined : data,
        extra,
      )
        .then(({ jsonResponse, sessionHeader }) => {
          APILOG(`${key} SUCCESS`, jsonResponse);
          if (!jsonResponse) {
            resolve({ sessionHeader });
            return;
          }

          if (
            exists(routeData.useJsonDataApiStore) &&
            !routeData.useJsonDataApiStore
          ) {
            resolve({ results: jsonResponse, meta: jsonResponse.meta });
          } else {
            const jsonApiStore = new JsonApiDataStore();
            const response = jsonApiStore.sync(jsonResponse);
            resolve({
              meta: jsonResponse.meta,
              results: jsonApiStore,
              response,
              sessionHeader,
            });
          }
        })
        .catch(apiError => {
          LOG(
            'request error or error in logic that handles the request',
            key,
            apiError,
          );
          APILOG(`${key} FAIL`, apiError);

          return reject({ key, endpoint, method, query, apiError });
        });
    });
});

const dontMergeData = routeData =>
  routeData.extra &&
  routeData.extra.headers &&
  (routeData.extra.headers['Content-Type'] === URL_ENCODED ||
    routeData.extra.headers['Content-Type'] === URL_FORM_DATA);

export default API_CALLS;
