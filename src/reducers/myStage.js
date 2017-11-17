import { SELECT_STAGE } from '../constants';
import { REHYDRATE } from 'redux-persist/constants';

const initialState = {
  stageId: null,
};

function myStageReducer(state = initialState, action) {
  switch (action.type) {
    case REHYDRATE:
      const incoming = action.payload.myStageReducer;
      if (incoming) {
        return {
          ...state,
          ...incoming,
        };
      }
      return state;
    case SELECT_STAGE:
      return { ...state, stageId: action.stageId };
    default:
      return state;
  }
}

export default myStageReducer;