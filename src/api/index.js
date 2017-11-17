import merge from 'lodash/merge';
import lodashForEach from 'lodash/forEach';
import request from './utils';
import apiRoutes from './routes';

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
      const authHeader = {};
      const extra = merge({}, { headers: authHeader }, routeData.extra);

      // Merge some default data from the routes with the data passed in
      const data = merge({}, routeData.data, d);
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
      ).then((response) => {
        APILOG(`${key} SUCCESS`, response);
        resolve(response);
      }).catch((err) => {
        APILOG(`${key} FAIL`, err);
        reject(err);
      });
    })
  );
});

export default API_CALLS;
