/* eslint-disable @typescript-eslint/no-explicit-any, complexity */

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

import { logout } from './auth/auth';
import { refreshAccessToken } from './auth/key';
import { refreshAnonymousLogin } from './auth/anonymous';
import { refreshMissionHubFacebookAccess } from './auth/facebook';

// WARNING: You shouldn't have to touch this file to change routes/mapping
// Put new routes in '../api/routes';

const METHODS_WITH_DATA = ['put', 'post', 'delete'];

export default function callApi(
  action: ApiRouteConfigEntry,
  query: { [key: string]: string } = {},
  data: { [key: string]: any } = {},
): ThunkAction<
  void,
  any,
  null,
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
        // @ts-ignore
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
      // @ts-ignore
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
