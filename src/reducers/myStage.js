import { REHYDRATE } from 'redux-persist/constants';
import { REQUESTS } from '../actions/api';
import { LOGOUT } from '../constants';

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
    case REQUESTS.UPDATE_MY_USER.SUCCESS:
      return { ...state, stageId: action.results.findAll('user')[0].pathway_stage_id };
    case REQUESTS.GET_ME.SUCCESS:
      return { ...state, stageId: action.results.findAll('user')[0].pathway_stage_id };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default myStageReducer;
