import { REQUESTS } from '../api/routes';

import callApi from './api';

export function refreshImpact(orgId?: string) {
  // @ts-ignore
  return dispatch => {
    dispatch(getImpactSummary('me'));
    if (orgId) {
      dispatch(getImpactSummary(undefined, orgId));
    }
    return dispatch(getImpactSummary());
  };
}

export function getImpactSummary(personId?: string, orgId?: string) {
  // @ts-ignore
  return dispatch => {
    const query = { person_id: personId, organization_id: orgId };
    return dispatch(callApi(REQUESTS.GET_IMPACT_SUMMARY, query));
  };
}
