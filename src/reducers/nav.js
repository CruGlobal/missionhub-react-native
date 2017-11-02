import { REHYDRATE } from 'redux-persist/constants';

import {FIRST_TIME, LOGIN, LOGOUT} from '../constants';
import { LoginRoutes, MainRoutes, FirstTimeRoutes, MainTabRoutes } from '../AppRoutes';

// Not logged in
const loginState = LoginRoutes.router.getStateForAction(LoginRoutes.router.getActionForPathAndParams('Login'));
// Logged in state
// Need to recreate the state of a stack nav with a tab nav in it
const mainState = MainRoutes.router.getStateForAction(MainTabRoutes.router.getActionForPathAndParams('InteractionsTab'));

const firstTimeState = FirstTimeRoutes.router.getStateForAction(FirstTimeRoutes.router.getActionForPathAndParams('Welcome'));

const initialNavState = loginState;

function navReducer(state = initialNavState, action) {
  // LOG('action', action, state);

  // Figure out which set of Routes to use when navigating
  let useLoginRoutes = true;
  let useFirstTimeRoutes = false;

  if (action.type.indexOf('Navigation') >= 0) {
    if (state.routes[0].key === 'InteractionsTab' || state.routes[0].routeName === 'MainTabs') {
      useLoginRoutes = false;
    } else if (state.routes[0].routeName === 'Welcome') {
      useFirstTimeRoutes = true;
    }
  }

  let nextState;
  switch (action.type) {
    // If the user is already logged in, use the main router
    // otherwise the logged in router
    case REHYDRATE:
      const incomingAuth = action.payload.auth;
      if (incomingAuth && incomingAuth.isLoggedIn) {
        return mainState;
      }
      return loginState;

    case LOGIN:
      return mainState;
    case LOGOUT:
      return loginState;
    case FIRST_TIME:
      return firstTimeState;
    default:
      if (!useLoginRoutes) {
        nextState = MainRoutes.router.getStateForAction(action, state);
      } else if (useFirstTimeRoutes) {
        nextState = FirstTimeRoutes.router.getStateForAction(action, state);
      } else {
        nextState = LoginRoutes.router.getStateForAction(action, state);
      }
      break;
  }

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
}


export default navReducer;