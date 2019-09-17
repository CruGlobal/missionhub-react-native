import i18n from 'i18next';

import { REQUESTS } from '../api/routes';
import { LOGOUT } from '../constants';
import { getLocalizedStages } from '../utils/stages';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Stage = any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LocalizedStage = any;

export interface StagesState {
  stageLocale: string;
  stages: Stage[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stagesObj: any;
}

const initialStagesState: StagesState = {
  stageLocale: '',
  stages: [],
  stagesObj: null,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function stagesReducer(state = initialStagesState, action: any) {
  switch (action.type) {
    case REQUESTS.GET_STAGES.SUCCESS:
      const stages = getLocalizedStages(
        (action.results || []).findAll('pathway_stage'),
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const stagesObj = stages.reduce((p: any, n: Stage) => {
        p[`${n.id}`] = n;
        return p;
      }, {});
      return {
        ...state,
        stageLocale: i18n.language,
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
