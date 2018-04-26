import { API_URL, THE_KEY_URL } from './utils';
import { URL_ENCODED } from '../constants';

const THE_KEY_OAUTH_URL = `${THE_KEY_URL}api/oauth/`;

const CHALLENGES_URL = `${API_URL}challenges/`;
const IMPACT_URL = `${API_URL}reports/impact`;
const REPORTS_URL = `${API_URL}reports/people`;

const AUTH_URL = `${API_URL}auth/`;
const PEOPLE_URL = `${API_URL}people/`;

const KEY_TOKEN = {
  endpoint: `${THE_KEY_OAUTH_URL}token`,
  method: 'post',
  extra: {
    stringify: false,
    headers: { 'Content-Type': URL_ENCODED },
  },
  anonymous: true,
  useJsonDataApiStore: false,
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
  //   Don't use jsonDataApiStore
  //   useJsonDataApiStore: false
  // },
  KEY_LOGIN: KEY_TOKEN,
  KEY_REFRESH_TOKEN: KEY_TOKEN,
  KEY_GET_TICKET: {
    endpoint: `${THE_KEY_OAUTH_URL}ticket?service=${AUTH_URL}thekey`,
    method: 'get',
    extra: {
      stringify: false,
    },
    useJsonDataApiStore: false,
  },
  TICKET_LOGIN: {
    endpoint: `${AUTH_URL}thekey`,
    method: 'post',
    useJsonDataApiStore: false,
  },
  FACEBOOK_LOGIN: {
    endpoint: `${AUTH_URL}facebook`,
    method: 'post',
    useJsonDataApiStore: false,
    anonymous: true,
  },
  GET_ME: {
    endpoint: `${PEOPLE_URL}me`,
  },
  GET_PERSON: {
    endpoint: `${PEOPLE_URL}:person_id`,
  },
  GET_PERSON_FEED: {
    endpoint: `${API_URL}person_feed`,
  },
  GET_STAGES: {
    endpoint: `${API_URL}pathway_stages`,
    anonymous: true,
  },
  GET_CHALLENGE_SUGGESTIONS: {
    endpoint: `${API_URL}challenge_suggestions`,
    anonymous: true,
  },
  ADD_CHALLENGES: {
    endpoint: `${PEOPLE_URL}:person_id`,
    method: 'put',
  },
  GET_MY_CHALLENGES: {
    endpoint: CHALLENGES_URL,
  },
  DELETE_CHALLENGE: {
    endpoint: `${CHALLENGES_URL}:challenge_id`,
    method: 'delete',
  },
  GET_CHALLENGES_BY_FILTER: {
    endpoint: CHALLENGES_URL,
  },
  CHALLENGE_COMPLETE: {
    endpoint: `${CHALLENGES_URL}:challenge_id`,
    method: 'put',
  },
  CHALLENGE_SET_FOCUS: {
    endpoint: `${CHALLENGES_URL}:challenge_id`,
    method: 'put',
  },
  GET_PEOPLE_LIST: {
    endpoint: PEOPLE_URL,
  },
  CREATE_MY_PERSON: {
    endpoint: `${AUTH_URL}client_token`,
    method: 'post',
    anonymous: true,
    useJsonDataApiStore: false,
  },
  REFRESH_ANONYMOUS_LOGIN: {
    endpoint: `${AUTH_URL}client_token`,
    method: 'post',
    anonymous: true,
    useJsonDataApiStore: false,
  },
  UPDATE_ME_USER: {
    endpoint: `${API_URL}users/me`,
    method: 'put',
  },
  ADD_NEW_PERSON: {
    endpoint: PEOPLE_URL,
    method: 'post',
  },
  UPDATE_PERSON: {
    endpoint: `${PEOPLE_URL}:personId`,
    method: 'put',
  },
  GET_MY_ORGANIZATIONS: {
    endpoint: `${API_URL}organizations`,
  },
  GET_ORGANIZATIONS: {
    endpoint: `${API_URL}organizations`,
  },
  GET_MY_GROUPS: {
    endpoint: `${API_URL}groups`,
  },
  GET_MY_SURVEYS: {
    endpoint: `${API_URL}surveys`,
  },
  GET_MY_LABELS: {
    endpoint: `${API_URL}organizations`,
    query: { include: 'labels' },
  },
  GET_MY_IMPACT: {
    endpoint: IMPACT_URL,
  },
  GET_IMPACT_BY_ID: {
    endpoint: IMPACT_URL,
  },
  GET_GLOBAL_IMPACT: {
    endpoint: IMPACT_URL,
  },
  GET_USER_IMPACT: {
    endpoint: REPORTS_URL,
  },
  SET_PUSH_TOKEN: {
    endpoint: `${API_URL}push_notification_device_tokens`,
    method: 'post',
  },
  DELETE_PUSH_TOKEN: {
    endpoint: `${API_URL}push_notification_device_tokens/:deviceId`,
    method: 'delete',
  },
  CREATE_CONTACT_ASSIGNMENT: {
    endpoint: `${API_URL}contact_assignments`,
    method: 'post',
  },
  UPDATE_CONTACT_ASSIGNMENT: {
    endpoint: `${API_URL}contact_assignments/:contactAssignmentId`,
    method: 'put',
  },
  DELETE_CONTACT_ASSIGNMENT: {
    endpoint: `${API_URL}contact_assignments/:contactAssignmentId`,
    method: 'delete',
  },
  ADD_NEW_INTERACTION: {
    endpoint: `${API_URL}interactions`,
    method: 'post',
  },
  EDIT_COMMENT: {
    endpoint: `${API_URL}interactions/:interactionId`,
    method: 'put',
  },
  SEARCH: {
    endpoint: `${API_URL}search`,
  },
  ADD_PERSON_NOTE: {
    endpoint: `${API_URL}person_notes`,
    method: 'post',
  },
  UPDATE_PERSON_NOTE: {
    endpoint: `${API_URL}person_notes/:noteId`,
    method: 'put',
  },
  GET_PERSON_NOTE: {
    endpoint: `${PEOPLE_URL}:person_id`,
  },
};
