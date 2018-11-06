import { AppNavigator } from '../routes';
import { MAIN_TABS } from '../constants';

// const initialState = AppNavigator.router.getStateForAction(
//   AppNavigator.router.getActionForPathAndParams(MAIN_TABS),
// );

export default function navReducer(state /* = initialState*/, action) {
  return AppNavigator.router.getStateForAction(action, state);
}
