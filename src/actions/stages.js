import { UPDATE_STAGES } from '../constants';

import callApi, { REQUESTS } from './api';

export function getStagesIfNotExists() {
  return (dispatch, getState) => {
    const stagesExist = !!getState().stages.stagesObj;
    if (stagesExist) {
      dispatch({
        type: UPDATE_STAGES,
        stages: getState().stages.stages,
      });
      return Promise.resolve();
    }
    return dispatch(getStages());
  };
}

export function getStages() {
  return dispatch => {
    return dispatch(
      callApi(REQUESTS.GET_STAGES, { include: 'localized_pathway_stages' }),
    );
  };
}
