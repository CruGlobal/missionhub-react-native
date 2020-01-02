/* eslint complexity: 0, max-lines-per-function: 0 */

import { CLEAR_UPGRADE_TOKEN, LOGOUT, UPDATE_TOKEN } from '../constants';
import { userIsJean } from '../utils/common';
import { REQUESTS } from '../api/routes';

import { Person } from './people';

export interface User {
  id: string;
  _type: 'user';
  timezone: string;
  hidden_organizations: string[];
  organization_order: string[];
  terms_acceptance_date: string;
  language: string;
  mobile_language: string;
  notification_settings?: string;
  pathway_stage_id: string;
  onboarding_status: string;
  username: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
  groups_feature: boolean;
}

export interface AuthPerson extends Person {
  user: User;
}

export interface AuthState {
  token: string;
  refreshToken: string;
  person: AuthPerson;
  isJean: boolean;
  upgradeToken: string | null;
}

const initialPerson: AuthPerson = {
  id: '',
  _type: 'person',
  created_at: '',
  first_name: '',
  full_name: '',
  gender: 'None',
  last_name: '',
  updated_at: '',
  email_addresses: [],
  pathway_progression_audits: [],
  phone_numbers: [],
  user: {
    id: '',
    _type: 'user',
    timezone: '',
    hidden_organizations: [],
    organization_order: [],
    terms_acceptance_date: '',
    language: '',
    mobile_language: '',
    pathway_stage_id: '',
    onboarding_status: '',
    username: '',
    created_at: '',
    updated_at: '',
    groups_feature: false,
  },
  answer_sheets: [],
  received_challenges: [],
  person_notes: [],
  reverse_contact_assignments: [],
  interactions: [],
  contact_assignments: [],
  organizational_permissions: [],
};

const initialAuthState: AuthState = {
  token: '',
  refreshToken: '',
  person: initialPerson,
  isJean: false,
  upgradeToken: null,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function authReducer(state = initialAuthState, action: any) {
  const results = action.results;

  switch (action.type) {
    case REQUESTS.KEY_LOGIN.SUCCESS:
      return {
        ...state,
        token: results.access_token,
        refreshToken: results.refresh_token,
      };
    case REQUESTS.KEY_REFRESH_TOKEN.SUCCESS:
      return {
        ...state,
        token: results.access_token,
      };
    case REQUESTS.TICKET_LOGIN.SUCCESS:
      return {
        ...state,
        token: results.token,
        person: {
          ...state.person,
          id: `${results.person_id}`,
        },
      };
    case REQUESTS.FACEBOOK_LOGIN.SUCCESS:
      return {
        ...state,
        token: results.token,
        person: {
          ...state.person,
          id: `${results.person_id}`,
        },
      };
    case REQUESTS.CREATE_MY_PERSON.SUCCESS:
      return {
        ...state,
        upgradeToken: action.data ? action.data.code : null,
        token: results.token,
        person: {
          ...state.person,
          id: `${results.person_id}`,
        },
      };
    case REQUESTS.REFRESH_ANONYMOUS_LOGIN.SUCCESS:
      return {
        ...state,
        token: results.token,
      };
    case REQUESTS.UPDATE_ME_USER.SUCCESS:
      return {
        ...state,
        person: {
          ...state.person,
          user: results.response,
        },
      };
    case REQUESTS.GET_ME.SUCCESS:
      const person = results.response;

      return {
        ...state,
        person,
        isJean: userIsJean(person.organizational_permissions),
      };
    case REQUESTS.GET_UNREAD_COMMENTS_NOTIFICATION.SUCCESS:
      return {
        ...state,
        person: {
          ...state.person,
          unread_comments_count: results.response.unread_comments_count,
        },
      };
    case UPDATE_TOKEN:
      return {
        ...state,
        token: action.token,
      };
    case CLEAR_UPGRADE_TOKEN:
      return {
        ...state,
        upgradeToken: initialAuthState.upgradeToken,
      };
    case LOGOUT:
      return initialAuthState;
    default:
      return state;
  }
}

export default authReducer;
