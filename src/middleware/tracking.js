import { trackState } from '../actions/analytics';
import { trackableScreens } from '../AppRoutes';
import { CONTACT_SCREEN } from '../containers/ContactScreen';
import { PERSON_STEPS, SELF_STEPS } from '../components/ContactHeader';
import { CONTACT_MENU_DRAWER, DRAWER_OPEN, MAIN_MENU_DRAWER, NAVIGATE_FORWARD, NAVIGATE_RESET } from '../constants';
import { REHYDRATE } from 'redux-persist/constants';

export default function tracking({ dispatch, getState }) {
  return (next) => (action) => {
    const returnValue = next(action);

    if (action.type === NAVIGATE_FORWARD) {
      const routeName = action.routeName;
      const route = trackableScreens[routeName];

      if (route) {
        dispatch(trackState(route.name));

      } else if (routeName === CONTACT_SCREEN) {
        dispatch(trackContactScreen(action, getState));

      } else if (routeName === DRAWER_OPEN) {
        if (action.params.drawer === CONTACT_MENU_DRAWER) {
          dispatch(trackContactMenu(action.params.isCurrentUser));

        } else if (action.params.drawer === MAIN_MENU_DRAWER) {
          dispatch(trackState('menu : menu'));
        }
      }

    } else if (action.type === 'Navigation/BACK') {
      // const screen = getState().analytics[ANALYTICS.PREVIOUS_SCREENNAME];
      // dispatch(trackState(screen));

    } else if (action.type === NAVIGATE_RESET) {
      const routeName = action.actions[0].routeName;
      dispatch(trackState(trackableScreens[routeName].name));

    } else if (action.type === REHYDRATE) {
      const savedRoutes = action.payload.nav.routes;
      const routeName = savedRoutes[savedRoutes.length - 1].routeName;

      dispatch(trackState(trackableScreens[routeName].name));
    }

    return returnValue;
  };
}

function trackContactScreen(action, getState) { //steps tab is shown when ContactScreen first loads
  if (action.params.person.id === getState().auth.personId) {
    return trackState(SELF_STEPS);
  }

  return trackState(PERSON_STEPS);
}

function trackContactMenu(isCurrentUser) {
  return isCurrentUser ? trackState('people : self : menu : menu') : trackState('people : person : menu : menu');
}
