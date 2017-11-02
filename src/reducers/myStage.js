import { SELECT_STAGE } from '../constants';

function myStageReducer(state = 0, action) {
  switch (action.type) {
    case SELECT_STAGE:
      return { ...state, stageId: action.payload.stageId };
    default:
      return state;
  }
}

export default myStageReducer;