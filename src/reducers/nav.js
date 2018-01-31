import { NavigationActions } from 'react-navigation';
import { REHYDRATE } from 'redux-persist/constants';
import { MainRoutes } from '../AppRoutes';
import { LOGIN_SCREEN } from '../containers/LoginScreen';

const initialState = MainRoutes.router.getStateForAction(MainRoutes.router.getActionForPathAndParams(LOGIN_SCREEN));

const loggedInState = MainRoutes.router.getStateForAction(NavigationActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: 'MainTabs' }),
  ],
}));

function navReducer(state = initialState, action) {
  let nextState;

  switch (action.type) {
    case REHYDRATE:
      if (action.payload && action.payload.auth && action.payload.auth.token && action.payload.auth.isLoggedIn) {
        return loggedInState;
      }
      return state;
    default:
      nextState = MainRoutes.router.getStateForAction(action, state);
  }

  return nextState || state;
}

export default navReducer;