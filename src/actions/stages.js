import i18n from 'i18next';

import { UPDATE_STAGES } from '../constants';
import { REQUESTS } from '../api/routes';

import callApi from './api';

export function getStagesIfNotExists() {
  return (dispatch, getState) => {
    const { stageLocale, stages, stagesObj } = getState().stages;

    const stagesExist = !!stagesObj;
    const localeNotChanged = i18n.language === stageLocale;

    if (stagesExist && localeNotChanged) {
      dispatch({
        type: UPDATE_STAGES,
        stages,
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
