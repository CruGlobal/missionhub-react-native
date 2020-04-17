import { REQUESTS } from '../api/routes';
import {
  LOGOUT,
  UPDATE_PEOPLE_INTERACTION_REPORT,
  INTERACTION_TYPES,
} from '../constants';

export interface ImpactState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  summary: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interactions: any;
}

const initialState = {
  summary: {},
  interactions: {},
};

// @ts-ignore
export default function impactReducer(
  state: ImpactState = initialState,
  action,
) {
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
            type =>
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

const storageKey = (personId?: string, orgId?: string) =>
  `${personId || ''}-${orgId || ''}`;
