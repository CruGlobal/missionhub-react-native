import { REQUESTS } from '../actions/api';
import { LOGOUT } from '../constants';

const initialStagesState = {
  stages: [],
  stagesObj: {},
};

function stagesReducer(state = initialStagesState, action) {
  switch (action.type) {
    case REQUESTS.GET_STAGES.SUCCESS:
      const stages = action.results.findAll('pathway_stage') || [];
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