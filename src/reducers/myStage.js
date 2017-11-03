import { SELECT_STAGE } from '../constants';

function myStageReducer(state = null, action) {
  switch (action.type) {
    case SELECT_STAGE:
      return { ...state, stageId: action.stageId };
    default:
      return state;
  }
}

export default myStageReducer;