import i18n from 'i18next';

import { UPDATE_STAGES } from '../constants';
import { REQUESTS } from '../api/routes';

import callApi from './api';

export function getStagesIfNotExists() {
  return (dispatch, getState) => {
    const { stages } = getState().stages;

    const localeNotChanged =
      stages && stages[0] && i18n.language === stages[0].locale;

    if (localeNotChanged) {
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
