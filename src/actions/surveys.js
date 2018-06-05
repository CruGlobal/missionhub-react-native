import { GET_GROUP_SURVEYS } from '../constants';

import callApi, { REQUESTS } from './api';

export function getMySurveys() {
  return dispatch => {
    const query = {
      limit: 100,
      include: '',
    };
    return dispatch(callApi(REQUESTS.GET_SURVEYS, query));
  };
}

export function getOrgSurveys(orgId) {
  const query = {
    organization_id: orgId,
    include: '',
  };
  return async dispatch => {
    const { response } = await dispatch(
      callApi(REQUESTS.GET_GROUP_SURVEYS, query),
    );
    dispatch({ type: GET_GROUP_SURVEYS, orgId, surveys: response });
    return response;
  };
}
