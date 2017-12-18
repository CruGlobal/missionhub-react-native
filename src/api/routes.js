import { API_URL } from './utils';

const PEOPLE = 'people/';

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
  //   Don't use jsonDataApiStore
  //   useJsonDataApiStore: false
  // },
  'GET_STAGES': {
    endpoint: API_URL + 'pathway_stages',
    method: 'get',
    anonymous: true,
  },
  'GET_CHALLENGE_SUGGESTIONS': {
    endpoint: API_URL + 'challenge_suggestions',
    anonymous: true,
  },
  'ADD_CHALLENGES': {
    endpoint: API_URL + PEOPLE + ':person_id',
    method: 'put',
  },
  'GET_MY_CHALLENGES': {
    endpoint: API_URL + 'challenges',
  },
  'CHALLENGE_COMPLETE': {
    endpoint: API_URL + 'challenges/:challenge_id',
    method: 'put',
  },
  'GET_PEOPLE_LIST': {
    endpoint: API_URL + PEOPLE,
  },
  'CREATE_MY_PERSON': {
    endpoint: API_URL + 'auth/client_token',
    method: 'post',
    anonymous: true,
    useJsonDataApiStore: false,
  },
  'UPDATE_MY_USER': {
    endpoint: API_URL + 'users/me',
    method: 'put',
  },
  'ADD_NEW_PERSON': {
    endpoint: API_URL + PEOPLE,
    method: 'post',
  },
  'GET_MY_ORGANIZATIONS': {
    endpoint: API_URL + 'organizations',
  },
  'GET_MY_GROUPS': {
    endpoint: API_URL + 'groups',
  },
  'GET_MY_SURVEYS': {
    endpoint: API_URL + 'surveys',
  },
  'GET_MY_IMPACT': {
    endpoint: API_URL + 'reports/impact',
  },
  'GET_GLOBAL_IMPACT': {
    endpoint: API_URL + 'reports/impact',
  },
  'CREATE_CONTACT_ASSIGNMENT': {
    endpoint: API_URL + 'contact_assignments',
    method: 'post',
  },
  'SEARCH': {
    endpoint: API_URL + 'search',
  },
  // 'TEST': {
  //   endpoint: API_URL + 'test/:someQueryParam/all',
  // },
};
