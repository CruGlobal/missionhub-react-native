import { URL_ENCODED, URL_FORM_DATA } from '../constants';

import { API_URL, THE_KEY_URL } from './utils';

const THE_KEY_OAUTH_URL = `${THE_KEY_URL}api/oauth/`;

const CHALLENGES_URL = `${API_URL}challenges/`;
const GROUP_CHALLENGE_URL = `${API_URL}community_challenges/`;
const GROUP_ACCEPTED_CHALLENGE_URL = `${API_URL}accepted_community_challenges/`;

const AUTH_URL = `${API_URL}auth/`;
const PEOPLE_URL = `${API_URL}people/`;
const SURVEY_URL = `${API_URL}surveys`;
const ORG_URL = `${API_URL}organizations`;

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
  GET_ORGANIZATIONS: {
    endpoint: ORG_URL,
  },
  ADD_NEW_ORGANIZATION: {
    endpoint: ORG_URL,
    method: 'post',
  },
  UPDATE_ORGANIZATION: {
    endpoint: `${ORG_URL}/:orgId`,
    method: 'put',
  },
  UPDATE_ORGANIZATION_IMAGE: {
    endpoint: `${ORG_URL}/:orgId`,
    method: 'put',
    extra: {
      stringify: false,
      headers: { 'Content-Type': URL_FORM_DATA },
    },
  },
  DELETE_ORGANIZATION: {
    endpoint: `${ORG_URL}/:orgId`,
    method: 'delete',
  },
  GET_GROUP_CELEBRATE_FEED: {
    endpoint: `${ORG_URL}/:orgId/celebration_items`,
  },
  LIKE_CELEBRATE_ITEM: {
    endpoint: `${ORG_URL}/:orgId/celebration_items/:eventId/like`,
    method: 'post',
  },
  UNLIKE_CELEBRATE_ITEM: {
    endpoint: `${ORG_URL}/:orgId/celebration_items/:eventId/like`,
    method: 'delete',
  },
  GET_GROUP_CHALLENGE_FEED: {
    endpoint: GROUP_CHALLENGE_URL,
  },
  ACCEPT_GROUP_CHALLENGE: {
    endpoint: GROUP_ACCEPTED_CHALLENGE_URL,
    method: 'post',
  },
  COMPLETE_GROUP_CHALLENGE: {
    endpoint: `${GROUP_ACCEPTED_CHALLENGE_URL}:challengeId`,
    method: 'put',
  },
  UPDATE_GROUP_CHALLENGE: {
    endpoint: `${GROUP_CHALLENGE_URL}:challengeId`,
    method: 'put',
  },
  CREATE_GROUP_CHALLENGE: {
    endpoint: `${GROUP_CHALLENGE_URL}`,
    method: 'post',
  },
  GET_MY_GROUPS: {
    endpoint: `${API_URL}groups`,
  },
  GET_SURVEY_QUESTIONS: {
    endpoint: `${SURVEY_URL}/:surveyId/questions`,
  },
  GET_SURVEYS: {
    endpoint: SURVEY_URL,
  },
  GET_GROUP_SURVEYS: {
    endpoint: SURVEY_URL,
  },
  GET_MY_LABELS: {
    endpoint: ORG_URL,
    query: { include: 'labels' },
  },
  GET_ORGANIZATION_LABELS: {
    endpoint: `${ORG_URL}/:orgId`,
  },
  GET_IMPACT_SUMMARY: {
    endpoint: `${API_URL}reports/impact`,
  },
  GET_PEOPLE_INTERACTIONS_REPORT: {
    endpoint: `${API_URL}reports/people`,
  },
  GET_ORGANIZATION_INTERACTIONS_REPORT: {
    endpoint: `${API_URL}reports/organizations`,
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
  GET_ANSWER_SHEETS: {
    endpoint: `${API_URL}answer_sheets`,
  },
};
