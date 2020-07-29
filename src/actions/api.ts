/* eslint-disable @typescript-eslint/no-explicit-any */

import { ThunkAction } from 'redux-thunk';

import API_CALLS from '../api';
// import { logoutAction, toastAction } from './auth';
import { REQUESTS, ApiRouteConfigEntry } from '../api/routes';
import { isObject } from '../utils/common';
import {
  EXPIRED_ACCESS_TOKEN,
  INVALID_ACCESS_TOKEN,
  INVALID_GRANT,
  UPDATE_TOKEN,
} from '../constants';
import { LOG, APILOG } from '../utils/logging';

import { logout, handleInvalidAccessToken } from './auth/auth';

// WARNING: You shouldn't have to touch this file to change routes/mapping
// Put new routes in '../api/routes';

const METHODS_WITH_DATA = ['put', 'post', 'delete'];

export default function callApi(
  action: ApiRouteConfigEntry,
  query: { [key: string]: any } = {},
  data: { [key: string]: any } = {},
): ThunkAction<
  any, // TODO: change to void after https://github.com/CruGlobal/missionhub-react-native/pull/1852 is merged
  any, // TODO: change to RootState after https://github.com/CruGlobal/missionhub-react-native/pull/1852 is merged
  null, // TODO: change to never after https://github.com/CruGlobal/missionhub-react-native/pull/1852 is merged
  | {
      query: any;
      data: any;
      type: string;
    }
  | {
      type: string;
      token: string;
    }
> {
  return async (dispatch, getState) => {
    // Generic error handler
    const throwErr = (msg: string) => {
      if (__DEV__) {
        LOG(msg);
        throw new Error(msg);
      }
      throw msg;
    };
    if (!action) {
      return throwErr(`callApi(): There is no type: ${JSON.stringify(action)}`);
    }
    const newQuery = {
      ...query,
    };

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
      return throwErr(`callApi(): API call is not a function: ${action.name}`);
    }

    // If there is a method that uses data, call it here
    if (action.method && METHODS_WITH_DATA.includes(action.method)) {
      if (
        !action.anonymous &&
        !newQuery.access_token &&
        !action.anonymousOptional
      ) {
        return throwErr(
          `There is no token and route is not anonymous: ${JSON.stringify({
            action,
            query: newQuery,
          })}`,
        );
      }
    }

    const handleError = (err: any) => {
      APILOG('REQUEST ERROR', action.name, err);
      const { apiError } = err;

      const errorDetail = apiError?.errors?.[0]?.detail;
      if (
        errorDetail === EXPIRED_ACCESS_TOKEN ||
        errorDetail === INVALID_ACCESS_TOKEN
      ) {
        return dispatch(handleInvalidAccessToken());
      } else if (
        apiError?.error === INVALID_GRANT &&
        action.name === REQUESTS.KEY_REFRESH_TOKEN.name
      ) {
        dispatch(logout(true));
        return;
      }
      throw err;
    };

    try {
      const response = await API_CALLS[action.name](newQuery, data);
      const actionResults: { [key: string]: any } = response // TODO: replace any. I gave up typing this for now. It could be absolutely anything and every field is optional.
        ? response.results || {}
        : {};
      actionResults.response = response && response.response;
      const meta = response && response.meta;
      // If the results have an error object, call this to reject it
      if (
        (isObject(actionResults) && actionResults.error) ||
        actionResults.errors
      ) {
        handleError(actionResults);
        return;
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
      return actionResults;
    } catch (error) {
      handleError(error);
    }
  };
}
