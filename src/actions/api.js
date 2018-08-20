import lodashForEach from 'lodash/forEach';

import API_CALLS from '../api';
// import { logoutAction, toastAction } from './auth';
import apiRoutes from '../api/routes';
import { isObject } from '../utils/common';
import {
  EXPIRED_ACCESS_TOKEN,
  INVALID_ACCESS_TOKEN,
  INVALID_GRANT,
  UPDATE_TOKEN,
} from '../constants';

import { logout, refreshAccessToken, refreshAnonymousLogin } from './auth';
import { refreshMissionHubFacebookAccess } from './facebook';

// WARNING: You shouldn't have to touch this file to change routes/mapping
// Put new routes in '../api/routes';

// Setup the requests to be used for this file
let REQUESTS = {};
lodashForEach(apiRoutes, (data, key) => {
  REQUESTS[key] = {
    ...data,
    name: key,
    FETCH: `${key}_FETCH`,
    SUCCESS: `${key}_SUCCESS`,
  };
});
export { REQUESTS };

const METHODS_WITH_DATA = ['put', 'post', 'delete'];

export default function callApi(requestObject, query = {}, data = {}) {
  return (dispatch, getState) =>
    new Promise((resolve, reject) => {
      // Generic error handler
      const throwErr = msg => {
        if (__DEV__) {
          LOG(msg);
          throw new Error(msg);
        }
        reject(msg);
      };
      if (!requestObject) {
        return throwErr(
          `callApi(): There is no type: ${JSON.stringify(requestObject)}`,
        );
      }
      let newQuery = { ...query };
      const action = requestObject;

      const authState = getState().auth;
      if (!action.anonymous) {
        const { token } = authState;
        // If the request has not already passed in an access token, set it
        if (!newQuery.access_token) {
          newQuery.access_token = token;
        }
      }

      dispatch({
        query: newQuery,
        data: data || {},
        type: action.FETCH,
      });

      if (
        !API_CALLS[action.name] ||
        typeof API_CALLS[action.name] !== 'function'
      ) {
        return throwErr(
          `callApi(): API call is not a function: ${action.name}`,
        );
      }

      // If there is a method that uses data, call it here
      if (METHODS_WITH_DATA.includes(action.method)) {
        if (!action.anonymous && !newQuery.access_token) {
          return throwErr(
            `There is no token and route is not anonymous: ${JSON.stringify(
              action,
            )}`,
          );
        }
      }

      const handleError = err => {
        APILOG('REQUEST ERROR', action.name, err);
        const { apiError } = err;

        if (apiError) {
          if (
            apiError.errors &&
            apiError.errors[0] &&
            apiError.errors[0].detail
          ) {
            const errorDetail = apiError.errors[0].detail;
            if (
              errorDetail === EXPIRED_ACCESS_TOKEN ||
              errorDetail === INVALID_ACCESS_TOKEN
            ) {
              if (authState.refreshToken) {
                dispatch(refreshAccessToken());
              } else if (authState.isFirstTime) {
                dispatch(refreshAnonymousLogin());
              } else {
                dispatch(refreshMissionHubFacebookAccess());
              }
            }
          } else if (
            apiError.error === INVALID_GRANT &&
            action.name === REQUESTS.KEY_REFRESH_TOKEN.name
          ) {
            dispatch(logout(true));
          }
        }
        reject(err);
      };

      API_CALLS[action.name](newQuery, data)
        .then(response => {
          let actionResults = response ? response.results || {} : {};
          actionResults.response = response && response.response;
          let meta = response && response.meta;
          // If the results have an error object, call this to reject it
          if (
            (isObject(actionResults) && actionResults.error) ||
            actionResults.errors
          ) {
            handleError(actionResults);
            return;
          }

          // If there is a mapping function, call it
          if (action.mapResults) {
            actionResults = action.mapResults(
              actionResults,
              newQuery,
              data,
              getState,
            );
          }

          dispatch({
            results: actionResults || {},
            query: newQuery,
            data,
            meta,
            type: action.SUCCESS,
          });

          if (response.sessionHeader) {
            dispatch({
              type: UPDATE_TOKEN,
              token: response.sessionHeader,
            });
          }

          // Add data to the results to be used by followup actions
          actionResults.meta = meta;
          resolve(actionResults);
        })
        .catch(handleError);
    });
}
