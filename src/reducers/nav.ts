import { MainRoutes } from '../AppRoutes';
import { LANDING_SCREEN } from '../containers/LandingScreen';

const initialState = MainRoutes.router.getStateForAction(
  MainRoutes.router.getActionForPathAndParams(LANDING_SCREEN),
);

// @ts-ignore
export default function navReducer(state = initialState, action) {
  return MainRoutes.router.getStateForAction(action, state);
}
