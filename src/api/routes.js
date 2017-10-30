// import { API_URL, AUTH_URL } from './utils';
import { AUTH_URL } from './utils';
import CONSTANTS from '../constants';

const CLIENT = {
  id: CONSTANTS.CLIENT_ID,
  secret: CONSTANTS.CLIENT_SECRET,
};

export default {
  // Example
  // 'PLANETS': {
  //   method: 'get', (defaults to get)
  //   anonymous: false, (defaults to false)
  //   endpoint: 'planets/1',
  //   (returns true if it's good or a string with the error message)
  //   beforeCall(query, data) {
  //     return true;
  //   }
  //   (gives header or other information)
  //   extra: {
  //     stringify: false,
  //     headers: { 'Content-Type': 'multipart/form-data' }
  //   },
  //   (map the results using all this info)
  //   mapResults: (results, query, data, getState) => results,
  //   (some default data that will merge with the data passed in)
  //   data: {}
  //   (some default query that will merge with the query passed in)
  //   query: {}
  //   (mark the api as a call that will show the loading state)
  //   showApiLoading: true
  // },
  'OAUTH': {
    endpoint: AUTH_URL + 'oauth/token',
    anonymous: true,
    method: 'post',
    data: {
      client: CLIENT,
      grant_type: 'password',
      scope: 'messenger',
    },
    // mapResults: mapAuth,
  },
  // 'ME': {
  //   endpoint: API_URL + 'me',
  //   anonymous: true,
  //   method: 'post',
  //   data: {
  //     client: CLIENT,
  //   },
  // },
};
