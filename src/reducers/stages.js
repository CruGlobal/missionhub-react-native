import { REQUESTS } from '../actions/api';

const initialStagesState = {};

function stagesReducer(state = initialStagesState, action) {
  switch (action.type) {
    case REQUESTS.GET_STAGES.SUCCESS:
      return {
        ...state,
        stages: action.results.findAll('pathway_stage'),
      };
    default:
      return state;
  }
}

export default stagesReducer;