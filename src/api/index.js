import merge from 'lodash/merge';
import lodashForEach from 'lodash/forEach';
import { JsonApiDataStore } from 'jsonapi-datastore';

import request from './utils';
import apiRoutes from './routes';
import { exists } from '../utils/common';
import { URL_ENCODED } from '../constants';
import { Alert } from 'react-native';

import locale from '../i18n/locales/en-US';
const { invalidCredentialsMessage, unexpectedErrorMessage, verifyEmailMessage, baseErrorMessage } = locale.login;

const VALID_METHODS = ['get', 'put', 'post', 'delete'];

// Setup API call
let API_CALLS = {};
lodashForEach(apiRoutes, (routeData, key) => {
  API_CALLS[key] = (q, d) => (
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
      let authHeader = {};
      if (!routeData.anonymous) {
        authHeader['Authorization'] = `Bearer ${q.access_token}`;
      }
      delete q.access_token;
      const extra = merge({}, { headers: authHeader }, routeData.extra);

      // Merge some default data from the routes with the data passed in
      const data = isUrlEncoded(routeData) ? d : merge({}, routeData.data, d);
      const query = merge({}, routeData.query, q);

      // Get the endpoint either from the query, or the routeData
      let endpoint = query.endpoint || routeData.endpoint;

      // Only do this for endpoints that have query parameters
      if (endpoint.includes('/:')) {
        // Replace all `:orgId` with the query param
        Object.keys(query).forEach((k) => {
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
      ).then((jsonResponse) => {
        APILOG(`${key} SUCCESS`, jsonResponse);
        if (!jsonResponse) {
          resolve(null);
          return;
        }
        if (exists(routeData.useJsonDataApiStore) && !routeData.useJsonDataApiStore) {
          resolve(jsonResponse);
        } else {
          const jsonApiStore = new JsonApiDataStore();
          jsonApiStore.sync(jsonResponse);
          resolve(jsonApiStore);
        }
      }).catch((err) => {
        LOG('request error or error in logic that handles the request', key, err);

        if (err['error'] === 'invalid_request' || err['thekey_authn_error'] === 'invalid_credentials') {
          return reject({ user_error: invalidCredentialsMessage });

        } else if (err['thekey_authn_error'] === 'email_unverified') {
          return reject({ user_error: verifyEmailMessage });

        } else {
          showAlert(routeData);

          APILOG(`${key} FAIL`, err);
          return reject(err);
        }
      });
    })
  );
});

const showAlert = (routeData) => {
  let errorMessage = `${unexpectedErrorMessage} ${baseErrorMessage}`;

  if (routeData.errorMessage) {
    errorMessage = `${routeData.errorMessage } ${baseErrorMessage}`;
  }

  Alert.alert('Error', errorMessage);
};

const isUrlEncoded = (routeData) => {
  return routeData.extra && routeData.extra.headers && routeData.extra.headers['Content-Type'] === URL_ENCODED;
};


export default API_CALLS;
