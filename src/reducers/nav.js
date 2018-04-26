import { MainRoutes } from '../AppRoutes';
import { LOGIN_SCREEN } from '../containers/LoginScreen';

const initialState = MainRoutes.router.getStateForAction(MainRoutes.router.getActionForPathAndParams(LOGIN_SCREEN));

export default function navReducer(state = initialState, action) {
  return MainRoutes.router.getStateForAction(action, state);
}
