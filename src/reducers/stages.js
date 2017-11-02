import { STAGES } from '../constants';

const initialStagesState = [];

function stagesReducer(state = initialStagesState, action) {
  switch (action.type) {
    case STAGES:
      return { ...state, stages: action.payload };
    default:
      return state;
  }
}

export default stagesReducer;