import { API_URL } from './utils';

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
    endpoint: API_URL + 'people/4141545',
    method: 'put',
  },
  'GET_MY_CHALLENGES': {
    endpoint: API_URL + 'challenges',
  },
  // 'TEST': {
  //   endpoint: API_URL + 'test/:someQueryParam/all',
  // },
};
