import { REQUESTS } from '../actions/api';
import { LOGOUT } from '../constants';

const initialStagesState = {
  stages: [],
};

function stagesReducer(state = initialStagesState, action) {
  switch (action.type) {
    case REQUESTS.GET_STAGES.SUCCESS:
      return {
        ...state,
        stages: action.results.findAll('pathway_stage'),
      };
    case LOGOUT:
      return initialStagesState;
    default:
      return state;
  }
}

export default stagesReducer;