import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import { store } from '../store';

export async function offlineEffect({ route, params = {}, data }, action) {
  const response = await offlineConfig.effect(generateRequest({ route, params, data }), action);
  // TODO: parse response with JsonApiDataStore and handle auth updates and auth and other errors
  return response;
}

function generateRequest({ route, params, data }) {
  const url = createUrl(useQueryParamsInPath(route.endpoint, params));

  return {
    url,
    method: route.method || 'get',
    body: route.method === 'get' ?
      undefined :
      route.extra && route.extra.stringify === false ?
        data :
        JSON.stringify(data),

    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...route.extra ?
        route.extra.headers :
        {},
      Authorization: route.anonymous ? undefined : `Bearer ${store.getState().auth.token}`,
    },
  };
}

function useQueryParamsInPath(endpoint, params) {
  return Object.keys(params).reduce(
    (acc, key) =>
      params[key] && acc.endpoint.includes(`:${key}`) ?
        {
          ...acc,
          endpoint: endpoint.replace(`:${key}`, params[key]),
        } :
        {
          ...acc,
          params: {
            ...acc.params,
            key: params[key],
          },
        },
    { endpoint, params: {} },
  );
}

function createUrl({ endpoint, params }) {
  const queryString = new URLSearchParams(params).toString(); // TODO: this seems to spit out [Object] object for {}
  return queryString ?
    `${endpoint}?${queryString}` :
    endpoint;
}
