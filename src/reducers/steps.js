import { REQUESTS } from '../actions/api';

const initialStagesState = {
  mine: [],
  suggestedForMe: [],
  suggestedForOthers: [],
};

function stagesReducer(state = initialStagesState, action) {
  switch (action.type) {
    case REQUESTS.GET_CHALLENGE_SUGGESTIONS.SUCCESS:
      // TODO: Filter this correctly
      const suggestions = action.results.findAll('challenge_suggestion') || [];
      return {
        ...state,
        // suggestedForMe: action.results.findAll('pathway_stage'),
        suggestedForMe: suggestions.filter((s) => s.self_step),
        suggestedForOthers: suggestions.filter((s) => !s.self_step),
      };
    default:
      return state;
  }
}

export default stagesReducer;