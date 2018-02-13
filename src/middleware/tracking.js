import { trackState } from '../actions/analytics';
import { trackableScreens } from '../AppRoutes';
import { CONTACT_SCREEN } from '../containers/ContactScreen';
import { PERSON_STEPS, SELF_STEPS } from '../components/ContactHeader';
import { CONTACT_MENU_DRAWER, DRAWER_OPEN, MAIN_MENU_DRAWER, NAVIGATE_FORWARD, NAVIGATE_RESET } from '../constants';
import { REHYDRATE } from 'redux-persist/constants';
import { buildTrackingObj } from '../utils/common';
import { LOGIN_SCREEN } from '../containers/LoginScreen';

export default function tracking({ dispatch, getState }) {
  return (next) => (action) => {
    let newAction;
    const returnValue = next(action);

    switch (action.type) {
      case NAVIGATE_FORWARD:
        const routeName = action.routeName;
        const trackedRoute = trackableScreens[routeName];

        if (trackedRoute) {
          newAction = trackState(trackedRoute.tracking);

        } else if (routeName === CONTACT_SCREEN) {
          newAction = trackContactScreen(action, getState);

        } else if (routeName === DRAWER_OPEN) {
          const actionParams = action.params;

          if (actionParams.drawer === CONTACT_MENU_DRAWER) {
            newAction = trackContactMenu(actionParams.isCurrentUser);

          } else if (actionParams.drawer === MAIN_MENU_DRAWER) {
            newAction = trackState(buildTrackingObj('menu : menu', 'menu'));
          }
        }
        break;

      case 'Navigation/BACK':
        // const screen = getState().analytics[ANALYTICS.PREVIOUS_SCREENNAME];
        // dispatch(trackState(screen));
        break;

      case NAVIGATE_RESET:
        newAction = trackRoute(action.actions[0]);
        break;

      case REHYDRATE:
        const nav = action.payload.nav;
        if (nav) {
          const savedRoutes = nav.routes;
          newAction = trackRoute(savedRoutes[savedRoutes.length - 1]);

        } else {
          newAction = trackState(trackableScreens[LOGIN_SCREEN]); //app is loaded for the very first time
        }

        break;
    }

    newAction && dispatch(newAction);
    return returnValue;
  };
}

function trackRoute(route) {
  const trackedRoute = trackableScreens[route.routeName];
  if (trackedRoute) {
    return trackState(trackedRoute.tracking);
  }
}

function trackContactScreen(action, getState) { //steps tab is shown when ContactScreen first loads
  if (action.params.person.id === getState().auth.personId) {
    return trackState(SELF_STEPS);
  }

  return trackState(PERSON_STEPS);
}

function trackContactMenu(isCurrentUser) {
  return isCurrentUser ? trackState(buildTrackingObj('people : self : menu : menu', 'people', 'self', 'menu'))
    : trackState(buildTrackingObj('people : person : menu : menu', 'people', 'person', 'menu'));
}
