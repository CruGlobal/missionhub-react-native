import { API_URL } from './utils';
import { URL_ENCODED } from '../constants';

const THE_KEY = 'https://stage.thekey.me/cas/api/oauth/';
const PEOPLE = 'people/';
const AUTH = 'auth/';

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
  'KEY_LOGIN': {
    endpoint: THE_KEY + 'token',
    method: 'post',
    extra: {
      stringify: false,
      headers: { 'Content-Type': URL_ENCODED },
    },
    anonymous: true,
    useJsonDataApiStore: false,
  },
  'KEY_GET_TICKET': {
    endpoint: THE_KEY + 'ticket?service=' + API_URL + AUTH + 'thekey',
    method: 'get',
    extra: {
      stringify: false,
    },
    useJsonDataApiStore: false,
  },
  'TICKET_LOGIN': {
    endpoint: API_URL + AUTH + 'thekey',
    method: 'post',
    useJsonDataApiStore: false,
  },
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
  // 'TEST': {
  //   endpoint: API_URL + 'test/:someQueryParam/all',
  // },
};
