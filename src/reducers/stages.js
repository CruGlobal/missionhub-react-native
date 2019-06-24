import { REQUESTS } from '../api/routes';
import { LOGOUT } from '../constants';
import { getLocalizedStages } from '../utils/common';

const initialStagesState = {
  stages: [],
  stagesObj: null,
};

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
