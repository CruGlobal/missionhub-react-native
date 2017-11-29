import {REHYDRATE} from 'redux-persist/constants';
import {MainRoutes} from '../AppRoutes';

const initialState = MainRoutes.router.getStateForAction(MainRoutes.router.getActionForPathAndParams('StageSuccess'));

function navReducer(state = initialState, action) {
  let nextState;

  switch (action.type) {
    case REHYDRATE:
      return state;
    default:
      nextState = MainRoutes.router.getStateForAction(action, state);
  }

  return nextState || state;
}

export default navReducer;