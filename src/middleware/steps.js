import { REQUESTS } from '../actions/api';
import { FILTERED_CHALLENGES } from '../constants';

export default function steps() {
  return (next) => (action) => {
    switch (action.type) {
      case REQUESTS.GET_CHALLENGE_SUGGESTIONS.SUCCESS:
        const suggestedForMe = {};
        const suggestedForOthers = {};

        const suggestions = action.results.findAll('challenge_suggestion');

        suggestions.forEach((suggestion) => {
          const pathwayStageId = suggestion.pathway_stage.id;

          if (suggestion.self_step) {
            pushOrCreate(suggestedForMe, pathwayStageId, suggestion);
          } else {

            pushOrCreate(suggestedForOthers, pathwayStageId, suggestion);
          }
        });

        return next({ type: FILTERED_CHALLENGES, suggestedForMe, suggestedForOthers });
    }

    return next(action);
  };
}

function pushOrCreate(array, index, element) {
  if (array[index]) {
    array[index].push(element);

  } else {
    array[index] = [ element ];
  }
}
