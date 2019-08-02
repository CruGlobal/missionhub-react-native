import { REQUESTS } from '../api/routes';
import { LOGOUT } from '../constants';
import { getLocalizedStages } from '../utils/common';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Stage = any;

export interface StagesState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stages: Stage[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stagesObj: any;
}

const initialStagesState: StagesState = {
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
