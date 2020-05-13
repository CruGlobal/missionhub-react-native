import { AnyAction } from 'redux';

import { REQUESTS } from '../api/routes';
import { LOGOUT } from '../constants';

export interface ImpactState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  summary: any;
}

const initialState = {
  summary: {},
};

export default function impactReducer(
  state: ImpactState = initialState,
  action: AnyAction,
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
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

const storageKey = (personId?: string, orgId?: string) =>
  `${personId || ''}-${orgId || ''}`;
