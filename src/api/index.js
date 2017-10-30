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
      const authHeader = q.access_token ? { Authorization: `Bearer ${q.access_token}` } : {};
      const extra = merge({}, { headers: authHeader }, routeData.extra);

      // Merge some default data from the routes with the data passed in
      const data = merge({}, routeData.data, d);
      const query = merge({}, routeData.query, q);

      // Get the endpoint either from the query, or the routeData
      const endpoint = query.endpoint || routeData.endpoint;
      if (query.endpoint) {
        delete query.endpoint;
      }

      // Call the request
      request(
        method,
        endpoint,
        query,
        method === 'get' ? undefined : data,
        extra,
      ).then(resolve).catch((err) => {
        LOG('request err', err);
        reject(err);
      });
    })
  );
});

export default API_CALLS;
