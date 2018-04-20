import { REHYDRATE } from 'redux-persist/constants';
import { MainRoutes } from '../AppRoutes';
import { LOGIN_SCREEN } from '../containers/LoginScreen';

const initialState = MainRoutes.router.getStateForAction(MainRoutes.router.getActionForPathAndParams(LOGIN_SCREEN));

export default function navReducer(state = initialState, action) {
  let nextState;

  switch (action.type) {
    case REHYDRATE:
      return action.payload.navigation;

    default:
      nextState = MainRoutes.router.getStateForAction(action, state);
  }

  return nextState || state;
}
