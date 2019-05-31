import i18n from 'i18next';

import { REQUESTS } from '../actions/api';
import { LOGOUT } from '../constants';
import { isObject } from '../utils/common';

const initialStagesState = {
  stages: [],
  stagesObj: null,
};

export function getLocalizedStages(stages) {
  return (stages || []).map(s => {
    const localizedStage =
      (s.localized_pathway_stages || []).find(
        ls => ls && isObject(ls) && ls.locale === i18n.language,
      ) || {};
    return { ...s, ...localizedStage };
  });
}

function stagesReducer(state = initialStagesState, action) {
  switch (action.type) {
    case REQUESTS.GET_STAGES.SUCCESS:
      const stages = getLocalizedStages(
        (action.results || []).findAll('pathway_stage'),
      );
      const stagesObj = stages.reduce((p, n) => {
        p[`${n.id}`] = n;
        return p;
      }, {});
      return {
        ...state,
        stages,
        stagesObj,
      };
    case LOGOUT:
      return initialStagesState;
    default:
      return state;
  }
}

export default stagesReducer;
