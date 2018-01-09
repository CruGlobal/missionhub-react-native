import { API_URL } from './utils';
import { URL_ENCODED } from '../constants';

const THE_KEY_URL = 'https://stage.thekey.me/cas/api/oauth/';

const CHALLENGES_URL = `${API_URL}challenges/`;
const IMPACT_URL = `${API_URL}reports/impact`;

const AUTH_URL = `${API_URL}auth/`;
const PEOPLE_URL = `${API_URL}people/`;

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
    endpoint: `${THE_KEY_URL}token`,
    method: 'post',
    extra: {
      stringify: false,
      headers: { 'Content-Type': URL_ENCODED },
    },
    anonymous: true,
    useJsonDataApiStore: false,
  },
  'KEY_GET_TICKET': {
    endpoint: `${THE_KEY_URL}ticket?service=${AUTH_URL}thekey`,
    method: 'get',
    extra: {
      stringify: false,
    },
    useJsonDataApiStore: false,
  },
  'TICKET_LOGIN': {
    endpoint: `${AUTH_URL}thekey`,
    method: 'post',
    useJsonDataApiStore: false,
  },
  'GET_STAGES': {
    endpoint: `${API_URL}pathway_stages`,
    method: 'get',
    anonymous: true,
  },
  'GET_CHALLENGE_SUGGESTIONS': {
    endpoint: `${API_URL}challenge_suggestions`,
    anonymous: true,
  },
  'ADD_CHALLENGES': {
    endpoint: `${PEOPLE_URL}:person_id`,
    method: 'put',
  },
  'GET_MY_CHALLENGES': {
    endpoint: CHALLENGES_URL,
  },
  'DELETE_CHALLENGE': {
    endpoint: `${CHALLENGES_URL}:challenge_id`,
    method: 'delete',
  },
  'GET_CHALLENGES_BY_FILTER': {
    endpoint: CHALLENGES_URL,
  },
  'CHALLENGE_COMPLETE': {
    endpoint: `${CHALLENGES_URL}:challenge_id`,
    method: 'put',
  },
  'GET_PEOPLE_LIST': {
    endpoint: PEOPLE_URL,
  },
  'CREATE_MY_PERSON': {
    endpoint: `${AUTH_URL}client_token`,
    method: 'post',
    anonymous: true,
    useJsonDataApiStore: false,
  },
  'UPDATE_MY_USER': {
    endpoint: `${API_URL}users/me`,
    method: 'put',
  },
  'UPDATE_USER': {
    endpoint: `${PEOPLE_URL}:userId`,
    method: 'put',
  },
  'ADD_NEW_PERSON': {
    endpoint: PEOPLE_URL,
    method: 'post',
  },
  'GET_MY_ORGANIZATIONS': {
    endpoint: `${API_URL}organizations`,
  },
  'GET_MY_GROUPS': {
    endpoint: `${API_URL}groups`,
  },
  'GET_MY_SURVEYS': {
    endpoint: `${API_URL}surveys`,
  },
  'GET_MY_LABELS': {
    endpoint: `${API_URL}organizations`,
    query: { include: 'labels' },
  },
  'GET_MY_IMPACT': {
    endpoint: IMPACT_URL,
  },
  'GET_GLOBAL_IMPACT': {
    endpoint: IMPACT_URL,
  },
  'GET_USER_DETAILS': {
    endpoint: `${PEOPLE_URL}:userId`,
  },
  'CREATE_CONTACT_ASSIGNMENT': {
    endpoint: `${API_URL}contact_assignments`,
    method: 'post',
  },
  'UPDATE_CONTACT_ASSIGNMENT': {
    endpoint: `${API_URL}contact_assignments/:contactAssignmentId`,
    method: 'put',
  },
  'SEARCH': {
    endpoint: `${API_URL}search`,
  },
};
