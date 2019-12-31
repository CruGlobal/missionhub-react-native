import { REQUESTS } from '../api/routes';
import {
  LOGOUT,
  INTERACTION_TYPES,
  UPDATE_PEOPLE_INTERACTION_REPORT,
} from '../constants';
import { Organization } from './organizations';
import { Person } from './people';

export interface Interaction {
  id: string;
  _type: 'interaction';
  created_by_id: string;
  interaction_type_name: string;
  interaction_type_id: number;
  updated_by_id: string;
  comment: string;
  privacy_setting: string;
  timestamp: string;
  created_at: string;
  organization: Organization;
  receiver: Person;
  creator: Person;
}

export interface ImpactState {
  summary: any;
  interactions: { [key: string]: Interaction };
}

const initialState: ImpactState = {
  summary: {},
  interactions: {},
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function impactReducer(state = initialState, action: any) {
  switch (action.type) {
    case REQUESTS.GET_IMPACT_SUMMARY.SUCCESS:
      const impact = action.results.response;
      return {
        ...state,
        summary: {
          ...state.summary,
          [storageKey(impact.person_id, impact.organization_id)]: impact,
        },
      };
    case UPDATE_PEOPLE_INTERACTION_REPORT:
      const key = storageKey(action.personId, action.organizationId);

      const report = action.personId
        ? action.report
        : action.report.filter(
            (type: { id: string }) =>
              type.id !==
                INTERACTION_TYPES.MHInteractionTypeAssignedContacts.id &&
              type.id !== INTERACTION_TYPES.MHInteractionTypeUncontacted.id,
          );

      return {
        ...state,
        interactions: {
          ...state.interactions,
          [key]: {
            ...state.interactions[key],
            [action.period]: report,
          },
        },
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

const storageKey = (personId: string, orgId: string) =>
  `${personId || ''}-${orgId || ''}`;
