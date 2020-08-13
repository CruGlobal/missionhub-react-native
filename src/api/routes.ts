/* eslint-disable max-lines */

import { URL_ENCODED, URL_FORM_DATA } from '../constants';

import { API_URL, THE_KEY_URL } from './utils';

const THE_KEY_OAUTH_URL = `${THE_KEY_URL}api/oauth`;

const CHALLENGES_URL = `${API_URL}/challenges`;
const GROUP_CHALLENGE_URL = `${API_URL}/community_challenges`;
const GROUP_ACCEPTED_CHALLENGE_URL = `${API_URL}/accepted_community_challenges`;

const AUTH_URL = `${API_URL}/auth`;
const PEOPLE_URL = `${API_URL}/people`;
const ORG_URL = `${API_URL}/organizations`;

const KEY_TOKEN = {
  endpoint: `${THE_KEY_OAUTH_URL}/token`,
  method: 'post',
  extra: {
    headers: { 'Content-Type': URL_ENCODED },
  },
  stringify: false,
  anonymous: true,
  useJsonDataApiStore: false,
};

export interface ApiRouteConfigEntry {
  name: string;
  FETCH: string;
  SUCCESS: string;
  endpoint: string;
  method?: string;
  extra?: RequestInit;
  stringify?: boolean;
  useJsonDataApiStore?: boolean;
  anonymous?: boolean;
  anonymousOptional?: boolean;
  include?: string;
}

export interface ApiRouteConfig {
  [key: string]: ApiRouteConfigEntry;
}

// NOTE: Uncomment this check teporarily if _typecheck below is failing
export const REQUESTS /*: ApiRouteConfig*/ = {
  // Example
  // 'PLANETS': {
  //   method: 'get', (defaults to get)
  //   anonymous: false, (defaults to false)
  //   Put the access token on if it exists, otherwise ignore it
  //   anonymousOptional: false, (defaults to false)
  //   endpoint: 'planets/1',
  //   (gives header or other information)
  //   extra: {
  //     headers: { 'Content-Type': 'multipart/form-data' }
  //   },
  //   stringify: false,
  //   (some default data that will merge with the data passed in)
  //   data: Record<string, unknown>
  //   (some default query that will merge with the query passed in)
  //   query: Record<string, unknown>
  //   Don't use jsonDataApiStore
  //   useJsonDataApiStore: false
  // },
  OKTA_TOKEN: {
    name: 'OKTA_TOKEN' as const,
    FETCH: 'OKTA_TOKEN_FETCH' as const,
    SUCCESS: 'OKTA_TOKEN_SUCCESS' as const,
    endpoint: 'https://dev1-signon.okta.com/oauth2/v1/token',
    method: 'post',
    stringify: false,
    anonymous: true,
    useJsonDataApiStore: false,
  },
  KEY_LOGIN: {
    name: 'KEY_LOGIN' as const,
    FETCH: 'KEY_LOGIN_FETCH' as const,
    SUCCESS: 'KEY_LOGIN_SUCCESS' as const,
    ...KEY_TOKEN,
  },
  KEY_REFRESH_TOKEN: {
    name: 'KEY_REFRESH_TOKEN' as const,
    FETCH: 'KEY_REFRESH_TOKEN_FETCH' as const,
    SUCCESS: 'KEY_REFRESH_TOKEN_SUCCESS' as const,
    ...KEY_TOKEN,
  },
  KEY_GET_TICKET: {
    name: 'KEY_GET_TICKET' as const,
    FETCH: 'KEY_GET_TICKET_FETCH' as const,
    SUCCESS: 'KEY_GET_TICKET_SUCCESS' as const,
    endpoint: `${THE_KEY_OAUTH_URL}/ticket?service=${AUTH_URL}/thekey`,
    method: 'get',
    stringify: false,
    useJsonDataApiStore: false,
  },
  TICKET_LOGIN: {
    name: 'TICKET_LOGIN' as const,
    FETCH: 'TICKET_LOGIN_FETCH' as const,
    SUCCESS: 'TICKET_LOGIN_SUCCESS' as const,
    endpoint: `${AUTH_URL}/thekey`,
    method: 'post',
    useJsonDataApiStore: false,
  },
  FACEBOOK_LOGIN: {
    name: 'FACEBOOK_LOGIN' as const,
    FETCH: 'FACEBOOK_LOGIN_FETCH' as const,
    SUCCESS: 'FACEBOOK_LOGIN_SUCCESS' as const,
    endpoint: `${AUTH_URL}/facebook`,
    method: 'post',
    useJsonDataApiStore: false,
    anonymous: true,
  },
  GET_ME: {
    name: 'GET_ME' as const,
    FETCH: 'GET_ME_FETCH' as const,
    SUCCESS: 'GET_ME_SUCCESS' as const,
    endpoint: `${PEOPLE_URL}/me`,
  },
  GET_UNREAD_COMMENTS_NOTIFICATION: {
    name: 'GET_UNREAD_COMMENTS_NOTIFICATION' as const,
    FETCH: 'GET_UNREAD_COMMENTS_NOTIFICATION_FETCH' as const,
    SUCCESS: 'GET_UNREAD_COMMENTS_NOTIFICATION_SUCCESS' as const,
    endpoint: `${PEOPLE_URL}/me`,
  },
  GET_PERSON: {
    name: 'GET_PERSON' as const,
    FETCH: 'GET_PERSON_FETCH' as const,
    SUCCESS: 'GET_PERSON_SUCCESS' as const,
    endpoint: `${PEOPLE_URL}/:person_id`,
  },
  GET_PERSON_FEED: {
    name: 'GET_PERSON_FEED' as const,
    FETCH: 'GET_PERSON_FEED_FETCH' as const,
    SUCCESS: 'GET_PERSON_FEED_SUCCESS' as const,
    endpoint: `${API_URL}/person_feed`,
  },
  GET_STAGES: {
    name: 'GET_STAGES' as const,
    FETCH: 'GET_STAGES_FETCH' as const,
    SUCCESS: 'GET_STAGES_SUCCESS' as const,
    endpoint: `${API_URL}/pathway_stages`,
    anonymous: true,
  },
  GET_CHALLENGE_SUGGESTIONS: {
    name: 'GET_CHALLENGE_SUGGESTIONS' as const,
    FETCH: 'GET_CHALLENGE_SUGGESTIONS_FETCH' as const,
    SUCCESS: 'GET_CHALLENGE_SUGGESTIONS_SUCCESS' as const,
    endpoint: `${API_URL}/challenge_suggestions`,
    anonymous: true,
  },
  ADD_CHALLENGE: {
    name: 'ADD_CHALLENGE' as const,
    FETCH: 'ADD_CHALLENGE_FETCH' as const,
    SUCCESS: 'ADD_CHALLENGE_SUCCESS' as const,
    endpoint: CHALLENGES_URL,
    method: 'post',
  },
  DELETE_CHALLENGE: {
    name: 'DELETE_CHALLENGE' as const,
    FETCH: 'DELETE_CHALLENGE_FETCH' as const,
    SUCCESS: 'DELETE_CHALLENGE_SUCCESS' as const,
    endpoint: `${CHALLENGES_URL}/:challenge_id`,
    method: 'delete',
  },
  GET_CHALLENGES_BY_FILTER: {
    name: 'GET_CHALLENGES_BY_FILTER' as const,
    FETCH: 'GET_CHALLENGES_BY_FILTER_FETCH' as const,
    SUCCESS: 'GET_CHALLENGES_BY_FILTER_SUCCESS' as const,
    endpoint: CHALLENGES_URL,
  },
  CHALLENGE_COMPLETE: {
    name: 'CHALLENGE_COMPLETE' as const,
    FETCH: 'CHALLENGE_COMPLETE_FETCH' as const,
    SUCCESS: 'CHALLENGE_COMPLETE_SUCCESS' as const,
    endpoint: `${CHALLENGES_URL}/:challenge_id`,
    method: 'put',
  },
  CHALLENGE_SET_FOCUS: {
    name: 'CHALLENGE_SET_FOCUS' as const,
    FETCH: 'CHALLENGE_SET_FOCUS_FETCH' as const,
    SUCCESS: 'CHALLENGE_SET_FOCUS_SUCCESS' as const,
    endpoint: `${CHALLENGES_URL}/:challenge_id`,
    method: 'put',
  },
  DELETE_CHALLENGE_REMINDER: {
    name: 'DELETE_CHALLENGE_REMINDER' as const,
    FETCH: 'DELETE_CHALLENGE_REMINDER_FETCH' as const,
    SUCCESS: 'DELETE_CHALLENGE_REMINDER_SUCCESS' as const,
    endpoint: `${CHALLENGES_URL}/:challenge_id/reminder`,
    method: 'delete',
  },
  CREATE_CHALLENGE_REMINDER: {
    name: 'CREATE_CHALLENGE_REMINDER' as const,
    FETCH: 'CREATE_CHALLENGE_REMINDER_FETCH' as const,
    SUCCESS: 'CREATE_CHALLENGE_REMINDER_SUCCESS' as const,
    endpoint: `${CHALLENGES_URL}/:challenge_id/reminder`,
    method: 'put',
  },
  GET_PEOPLE_LIST: {
    name: 'GET_PEOPLE_LIST' as const,
    FETCH: 'GET_PEOPLE_LIST_FETCH' as const,
    SUCCESS: 'GET_PEOPLE_LIST_SUCCESS' as const,
    endpoint: PEOPLE_URL,
  },
  CREATE_MY_PERSON: {
    name: 'CREATE_MY_PERSON' as const,
    FETCH: 'CREATE_MY_PERSON_FETCH' as const,
    SUCCESS: 'CREATE_MY_PERSON_SUCCESS' as const,
    endpoint: `${AUTH_URL}/client_token`,
    method: 'post',
    anonymous: true,
    useJsonDataApiStore: false,
  },
  REFRESH_ANONYMOUS_LOGIN: {
    name: 'REFRESH_ANONYMOUS_LOGIN' as const,
    FETCH: 'REFRESH_ANONYMOUS_LOGIN_FETCH' as const,
    SUCCESS: 'REFRESH_ANONYMOUS_LOGIN_SUCCESS' as const,
    endpoint: `${AUTH_URL}/client_token`,
    method: 'post',
    anonymous: true,
    useJsonDataApiStore: false,
  },
  UPDATE_ME_USER: {
    name: 'UPDATE_ME_USER' as const,
    FETCH: 'UPDATE_ME_USER_FETCH' as const,
    SUCCESS: 'UPDATE_ME_USER_SUCCESS' as const,
    endpoint: `${API_URL}/users/me`,
    method: 'put',
  },
  ADD_NEW_PERSON: {
    name: 'ADD_NEW_PERSON' as const,
    FETCH: 'ADD_NEW_PERSON_FETCH' as const,
    SUCCESS: 'ADD_NEW_PERSON_SUCCESS' as const,
    endpoint: PEOPLE_URL,
    method: 'post',
  },
  UPDATE_PERSON: {
    name: 'UPDATE_PERSON' as const,
    FETCH: 'UPDATE_PERSON_FETCH' as const,
    SUCCESS: 'UPDATE_PERSON_SUCCESS' as const,
    endpoint: `${PEOPLE_URL}/:personId`,
    method: 'put',
  },
  GET_ORGANIZATIONS: {
    name: 'GET_ORGANIZATIONS' as const,
    FETCH: 'GET_ORGANIZATIONS_FETCH' as const,
    SUCCESS: 'GET_ORGANIZATIONS_SUCCESS' as const,
    endpoint: ORG_URL,
  },
  LOOKUP_COMMUNITY_CODE: {
    name: 'LOOKUP_COMMUNITY_CODE' as const,
    FETCH: 'LOOKUP_COMMUNITY_CODE_FETCH' as const,
    SUCCESS: 'LOOKUP_COMMUNITY_CODE_SUCCESS' as const,
    endpoint: `${ORG_URL}/find_by_code`,
    anonymousOptional: true,
  },
  LOOKUP_COMMUNITY_URL: {
    name: 'LOOKUP_COMMUNITY_URL' as const,
    FETCH: 'LOOKUP_COMMUNITY_URL_FETCH' as const,
    SUCCESS: 'LOOKUP_COMMUNITY_URL_SUCCESS' as const,
    endpoint: `${ORG_URL}/find_by_url`,
    anonymousOptional: true,
  },
  JOIN_COMMUNITY: {
    name: 'JOIN_COMMUNITY' as const,
    FETCH: 'JOIN_COMMUNITY_FETCH' as const,
    SUCCESS: 'JOIN_COMMUNITY_SUCCESS' as const,
    endpoint: `${API_URL}/organizational_permissions`,
    anonymousOptional: true,
    method: 'post',
  },
  ADD_NEW_ORGANIZATION: {
    name: 'ADD_NEW_ORGANIZATION' as const,
    FETCH: 'ADD_NEW_ORGANIZATION_FETCH' as const,
    SUCCESS: 'ADD_NEW_ORGANIZATION_SUCCESS' as const,
    endpoint: ORG_URL,
    method: 'post',
  },
  GET_ORGANIZATION: {
    name: 'GET_ORGANIZATION' as const,
    FETCH: 'GET_ORGANIZATION_FETCH' as const,
    SUCCESS: 'GET_ORGANIZATION_SUCCESS' as const,
    endpoint: `${ORG_URL}/:orgId`,
  },
  UPDATE_ORGANIZATION: {
    name: 'UPDATE_ORGANIZATION' as const,
    FETCH: 'UPDATE_ORGANIZATION_FETCH' as const,
    SUCCESS: 'UPDATE_ORGANIZATION_SUCCESS' as const,
    endpoint: `${ORG_URL}/:orgId`,
    method: 'put',
  },
  UPDATE_ORGANIZATION_IMAGE: {
    name: 'UPDATE_ORGANIZATION_IMAGE' as const,
    FETCH: 'UPDATE_ORGANIZATION_IMAGE_FETCH' as const,
    SUCCESS: 'UPDATE_ORGANIZATION_IMAGE_SUCCESS' as const,
    endpoint: `${ORG_URL}/:orgId`,
    method: 'put',
    extra: {
      headers: { 'Content-Type': URL_FORM_DATA },
    },
    stringify: false,
  },
  DELETE_ORGANIZATION: {
    name: 'DELETE_ORGANIZATION' as const,
    FETCH: 'DELETE_ORGANIZATION_FETCH' as const,
    SUCCESS: 'DELETE_ORGANIZATION_SUCCESS' as const,
    endpoint: `${ORG_URL}/:orgId`,
    method: 'delete',
  },
  TRANSFER_ORG_OWNERSHIP: {
    name: 'TRANSFER_ORG_OWNERSHIP' as const,
    FETCH: 'TRANSFER_ORG_OWNERSHIP_FETCH' as const,
    SUCCESS: 'TRANSFER_ORG_OWNERSHIP_SUCCESS' as const,
    endpoint: `${ORG_URL}/:orgId/community_owner`,
    method: 'put',
  },
  GET_GROUP_CELEBRATE_FEED: {
    name: 'GET_GROUP_CELEBRATE_FEED' as const,
    FETCH: 'GET_GROUP_CELEBRATE_FEED_FETCH' as const,
    SUCCESS: 'GET_GROUP_CELEBRATE_FEED_SUCCESS' as const,
    endpoint: `${ORG_URL}/:orgId/celebration_items`,
  },
  GET_GROUP_CELEBRATE_FEED_UNREAD: {
    name: 'GET_GROUP_CELEBRATE_FEED_UNREAD' as const,
    FETCH: 'GET_GROUP_CELEBRATE_FEED_UNREAD_FETCH' as const,
    SUCCESS: 'GET_GROUP_CELEBRATE_FEED_UNREAD_SUCCESS' as const,
    endpoint: `${ORG_URL}/:orgId/celebration_items`,
  },
  GET_GLOBAL_CELEBRATE_FEED: {
    name: 'GET_GLOBAL_CELEBRATE_FEED' as const,
    FETCH: 'GET_GLOBAL_CELEBRATE_FEED_FETCH' as const,
    SUCCESS: 'GET_GLOBAL_CELEBRATE_FEED_SUCCESS' as const,
    endpoint: `${API_URL}/global_celebration_items`,
  },
  GET_CELEBRATE_COMMENTS: {
    name: 'GET_CELEBRATE_COMMENTS' as const,
    FETCH: 'GET_CELEBRATE_COMMENTS_FETCH' as const,
    SUCCESS: 'GET_CELEBRATE_COMMENTS_SUCCESS' as const,
    endpoint: `${ORG_URL}/:orgId/celebration_items/:eventId/comments`,
  },
  CREATE_CELEBRATE_COMMENT: {
    name: 'CREATE_CELEBRATE_COMMENT' as const,
    FETCH: 'CREATE_CELEBRATE_COMMENT_FETCH' as const,
    SUCCESS: 'CREATE_CELEBRATE_COMMENT_SUCCESS' as const,
    endpoint: `${ORG_URL}/:orgId/celebration_items/:eventId/comments`,
    method: 'post',
  },
  UPDATE_CELEBRATE_COMMENT: {
    name: 'UPDATE_CELEBRATE_COMMENT' as const,
    FETCH: 'UPDATE_CELEBRATE_COMMENT_FETCH' as const,
    SUCCESS: 'UPDATE_CELEBRATE_COMMENT_SUCCESS' as const,
    endpoint: `${ORG_URL}/:orgId/celebration_items/:eventId/comments/:commentId`,
    method: 'put',
  },
  DELETE_CELEBRATE_COMMENT: {
    name: 'DELETE_CELEBRATE_COMMENT' as const,
    FETCH: 'DELETE_CELEBRATE_COMMENT_FETCH' as const,
    SUCCESS: 'DELETE_CELEBRATE_COMMENT_SUCCESS' as const,
    endpoint: `${ORG_URL}/:orgId/celebration_items/:eventId/comments/:commentId`,
    method: 'delete',
  },
  MARK_ORG_COMMENTS_AS_READ: {
    name: 'MARK_ORG_COMMENTS_AS_READ' as const,
    FETCH: 'MARK_ORG_COMMENTS_AS_READ_FETCH' as const,
    SUCCESS: 'MARK_ORG_COMMENTS_AS_READ_SUCCESS' as const,
    endpoint: `${API_URL}/unread_items`,
    method: 'delete',
  },
  GET_REPORTED_COMMENTS: {
    name: 'GET_REPORTED_COMMENTS' as const,
    FETCH: 'GET_REPORTED_COMMENTS_FETCH' as const,
    SUCCESS: 'GET_REPORTED_COMMENTS_SUCCESS' as const,
    endpoint: `${ORG_URL}/:orgId/comment_reports`,
  },
  CREATE_REPORT_COMMENT: {
    name: 'CREATE_REPORT_COMMENT' as const,
    FETCH: 'CREATE_REPORT_COMMENT_FETCH' as const,
    SUCCESS: 'CREATE_REPORT_COMMENT_SUCCESS' as const,
    endpoint: `${ORG_URL}/:orgId/comment_reports`,
    method: 'post',
  },
  UPDATE_REPORT_COMMENT: {
    name: 'UPDATE_REPORT_COMMENT' as const,
    FETCH: 'UPDATE_REPORT_COMMENT_FETCH' as const,
    SUCCESS: 'UPDATE_REPORT_COMMENT_SUCCESS' as const,
    endpoint: `${ORG_URL}/:orgId/comment_reports/:reportCommentId`,
    method: 'put',
  },
  ORGANIZATION_NEW_CODE: {
    name: 'ORGANIZATION_NEW_CODE' as const,
    FETCH: 'ORGANIZATION_NEW_CODE_FETCH' as const,
    SUCCESS: 'ORGANIZATION_NEW_CODE_SUCCESS' as const,
    endpoint: `${ORG_URL}/:orgId/community_code`,
    method: 'put',
  },
  ORGANIZATION_NEW_LINK: {
    name: 'ORGANIZATION_NEW_LINK' as const,
    FETCH: 'ORGANIZATION_NEW_LINK_FETCH' as const,
    SUCCESS: 'ORGANIZATION_NEW_LINK_SUCCESS' as const,
    endpoint: `${ORG_URL}/:orgId/community_url`,
    method: 'put',
  },
  GET_GROUP_CHALLENGE_FEED: {
    name: 'GET_GROUP_CHALLENGE_FEED' as const,
    FETCH: 'GET_GROUP_CHALLENGE_FEED_FETCH' as const,
    SUCCESS: 'GET_GROUP_CHALLENGE_FEED_SUCCESS' as const,
    endpoint: GROUP_CHALLENGE_URL,
  },
  ACCEPT_GROUP_CHALLENGE: {
    name: 'ACCEPT_GROUP_CHALLENGE' as const,
    FETCH: 'ACCEPT_GROUP_CHALLENGE_FETCH' as const,
    SUCCESS: 'ACCEPT_GROUP_CHALLENGE_SUCCESS' as const,
    endpoint: GROUP_ACCEPTED_CHALLENGE_URL,
    method: 'post',
  },
  COMPLETE_GROUP_CHALLENGE: {
    name: 'COMPLETE_GROUP_CHALLENGE' as const,
    FETCH: 'COMPLETE_GROUP_CHALLENGE_FETCH' as const,
    SUCCESS: 'COMPLETE_GROUP_CHALLENGE_SUCCESS' as const,
    endpoint: `${GROUP_ACCEPTED_CHALLENGE_URL}/:challengeId`,
    method: 'put',
  },
  UPDATE_GROUP_CHALLENGE: {
    name: 'UPDATE_GROUP_CHALLENGE' as const,
    FETCH: 'UPDATE_GROUP_CHALLENGE_FETCH' as const,
    SUCCESS: 'UPDATE_GROUP_CHALLENGE_SUCCESS' as const,
    endpoint: `${GROUP_CHALLENGE_URL}/:challenge_id`,
    method: 'put',
  },
  CREATE_GROUP_CHALLENGE: {
    name: 'CREATE_GROUP_CHALLENGE' as const,
    FETCH: 'CREATE_GROUP_CHALLENGE_FETCH' as const,
    SUCCESS: 'CREATE_GROUP_CHALLENGE_SUCCESS' as const,
    endpoint: GROUP_CHALLENGE_URL,
    method: 'post',
  },
  GET_GROUP_CHALLENGE: {
    name: 'GET_GROUP_CHALLENGE' as const,
    FETCH: 'GET_GROUP_CHALLENGE_FETCH' as const,
    SUCCESS: 'GET_GROUP_CHALLENGE_SUCCESS' as const,
    endpoint: `${GROUP_CHALLENGE_URL}/:challenge_id`,
  },
  GET_MY_GROUPS: {
    name: 'GET_MY_GROUPS' as const,
    FETCH: 'GET_MY_GROUPS_FETCH' as const,
    SUCCESS: 'GET_MY_GROUPS_SUCCESS' as const,
    endpoint: `${API_URL}/groups`,
  },
  GET_MY_LABELS: {
    name: 'GET_MY_LABELS' as const,
    FETCH: 'GET_MY_LABELS_FETCH' as const,
    SUCCESS: 'GET_MY_LABELS_SUCCESS' as const,
    endpoint: ORG_URL,
    include: 'labels',
  },
  GET_ORGANIZATION_FILTER_STATS: {
    name: 'GET_ORGANIZATION_FILTER_STATS' as const,
    FETCH: 'GET_ORGANIZATION_FILTER_STATS_FETCH' as const,
    SUCCESS: 'GET_ORGANIZATION_FILTER_STATS_SUCCESS' as const,
    endpoint: `${API_URL}/filter_stats/people`,
  },
  GET_IMPACT_SUMMARY: {
    name: 'GET_IMPACT_SUMMARY' as const,
    FETCH: 'GET_IMPACT_SUMMARY_FETCH' as const,
    SUCCESS: 'GET_IMPACT_SUMMARY_SUCCESS' as const,
    endpoint: `${API_URL}/reports/impact`,
  },
  GET_PEOPLE_INTERACTIONS_REPORT: {
    name: 'GET_PEOPLE_INTERACTIONS_REPORT' as const,
    FETCH: 'GET_PEOPLE_INTERACTIONS_REPORT_FETCH' as const,
    SUCCESS: 'GET_PEOPLE_INTERACTIONS_REPORT_SUCCESS' as const,
    endpoint: `${API_URL}/reports/people`,
  },
  GET_ORGANIZATION_INTERACTIONS_REPORT: {
    name: 'GET_ORGANIZATION_INTERACTIONS_REPORT' as const,
    FETCH: 'GET_ORGANIZATION_INTERACTIONS_REPORT_FETCH' as const,
    SUCCESS: 'GET_ORGANIZATION_INTERACTIONS_REPORT_SUCCESS' as const,
    endpoint: `${API_URL}/reports/organizations`,
  },
  GET_USERS_REPORT: {
    name: 'GET_USERS_REPORT' as const,
    FETCH: 'GET_USERS_REPORT_FETCH' as const,
    SUCCESS: 'GET_USERS_REPORT_SUCCESS' as const,
    endpoint: `${API_URL}/reports/users`,
  },
  SET_PUSH_TOKEN: {
    name: 'SET_PUSH_TOKEN' as const,
    FETCH: 'SET_PUSH_TOKEN_FETCH' as const,
    SUCCESS: 'SET_PUSH_TOKEN_SUCCESS' as const,
    endpoint: `${API_URL}/push_notification_device_tokens`,
    method: 'post',
  },
  DELETE_PUSH_TOKEN: {
    name: 'DELETE_PUSH_TOKEN' as const,
    FETCH: 'DELETE_PUSH_TOKEN_FETCH' as const,
    SUCCESS: 'DELETE_PUSH_TOKEN_SUCCESS' as const,
    endpoint: `${API_URL}/push_notification_device_tokens/:deviceId`,
    method: 'delete',
  },
  CREATE_CONTACT_ASSIGNMENT: {
    name: 'CREATE_CONTACT_ASSIGNMENT' as const,
    FETCH: 'CREATE_CONTACT_ASSIGNMENT_FETCH' as const,
    SUCCESS: 'CREATE_CONTACT_ASSIGNMENT_SUCCESS' as const,
    endpoint: `${API_URL}/contact_assignments`,
    method: 'post',
  },
  UPDATE_CONTACT_ASSIGNMENT: {
    name: 'UPDATE_CONTACT_ASSIGNMENT' as const,
    FETCH: 'UPDATE_CONTACT_ASSIGNMENT_FETCH' as const,
    SUCCESS: 'UPDATE_CONTACT_ASSIGNMENT_SUCCESS' as const,
    endpoint: `${API_URL}/contact_assignments/:contactAssignmentId`,
    method: 'put',
  },
  DELETE_CONTACT_ASSIGNMENT: {
    name: 'DELETE_CONTACT_ASSIGNMENT' as const,
    FETCH: 'DELETE_CONTACT_ASSIGNMENT_FETCH' as const,
    SUCCESS: 'DELETE_CONTACT_ASSIGNMENT_SUCCESS' as const,
    endpoint: `${API_URL}/contact_assignments/:contactAssignmentId`,
    method: 'delete',
  },
  ADD_NEW_INTERACTION: {
    name: 'ADD_NEW_INTERACTION' as const,
    FETCH: 'ADD_NEW_INTERACTION_FETCH' as const,
    SUCCESS: 'ADD_NEW_INTERACTION_SUCCESS' as const,
    endpoint: `${API_URL}/interactions`,
    method: 'post',
  },
  EDIT_COMMENT: {
    name: 'EDIT_COMMENT' as const,
    FETCH: 'EDIT_COMMENT_FETCH' as const,
    SUCCESS: 'EDIT_COMMENT_SUCCESS' as const,
    endpoint: `${API_URL}/interactions/:interactionId`,
    method: 'put',
  },
  SEARCH: {
    name: 'SEARCH' as const,
    FETCH: 'SEARCH_FETCH' as const,
    SUCCESS: 'SEARCH_SUCCESS' as const,
    endpoint: `${API_URL}/search`,
  },
  ADD_PERSON_NOTE: {
    name: 'ADD_PERSON_NOTE' as const,
    FETCH: 'ADD_PERSON_NOTE_FETCH' as const,
    SUCCESS: 'ADD_PERSON_NOTE_SUCCESS' as const,
    endpoint: `${API_URL}/person_notes`,
    method: 'post',
  },
  UPDATE_PERSON_NOTE: {
    name: 'UPDATE_PERSON_NOTE' as const,
    FETCH: 'UPDATE_PERSON_NOTE_FETCH' as const,
    SUCCESS: 'UPDATE_PERSON_NOTE_SUCCESS' as const,
    endpoint: `${API_URL}/person_notes/:noteId`,
    method: 'put',
  },
  GET_PERSON_NOTE: {
    name: 'GET_PERSON_NOTE' as const,
    FETCH: 'GET_PERSON_NOTE_FETCH' as const,
    SUCCESS: 'GET_PERSON_NOTE_SUCCESS' as const,
    endpoint: `${PEOPLE_URL}/:person_id`,
  },
  GET_ANSWER_SHEETS: {
    name: 'GET_ANSWER_SHEETS' as const,
    FETCH: 'GET_ANSWER_SHEETS_FETCH' as const,
    SUCCESS: 'GET_ANSWER_SHEETS_SUCCESS' as const,
    endpoint: `${API_URL}/answer_sheets`,
  },
};

// NOTE: If this typecheck is failing, temporarily enable the check above on apiRoutes to find the issue
const _typecheck: ApiRouteConfig = REQUESTS;
_typecheck;
