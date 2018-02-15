import { NavigationActions } from 'react-navigation';
import { REHYDRATE } from 'redux-persist/constants';
import { MainRoutes } from '../AppRoutes';
import { LOGIN_SCREEN } from '../containers/LoginScreen';
import { MAIN_TABS } from '../constants';
import { isLoggedIn } from '../utils/common';

const initialState = MainRoutes.router.getStateForAction(MainRoutes.router.getActionForPathAndParams(LOGIN_SCREEN));

const loggedInState = MainRoutes.router.getStateForAction(NavigationActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: MAIN_TABS }),
  ],
}));

function navReducer(state = initialState, action) {
  let nextState;

  switch (action.type) {
    case REHYDRATE:
      const authState = action.payload.auth;

      if (authState && isLoggedIn(authState)) {
        return loggedInState;
      }
      return state;
    default:
      nextState = MainRoutes.router.getStateForAction(action, state);
  }

  return nextState || state;
}

export default navReducer;
