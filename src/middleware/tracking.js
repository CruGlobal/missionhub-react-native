import { trackState } from '../actions/analytics';
import { trackableScreens } from '../AppRoutes';
import { CONTACT_SCREEN } from '../containers/ContactScreen';
import { PERSON_STEPS, SELF_STEPS } from '../components/ContactHeader';
import { CONTACT_MENU_DRAWER, DRAWER_OPEN, MAIN_MENU_DRAWER, NAVIGATE_FORWARD, NAVIGATE_RESET } from '../constants';
import { buildTrackingObj } from '../utils/common';

export default function tracking({ dispatch, getState }) {
  return (next) => (action) => {
    let newState;
    const returnValue = next(action);
    const { nav: navState, auth: authState } = getState();

    switch (action.type) {
      case NAVIGATE_FORWARD:
        newState = getNextTrackState(action, authState);
        break;

      case 'Navigation/BACK':
      case 'Navigation/POP':
        const routes = navState.routes;
        newState = getNextTrackState(routes[routes.length - 1], authState);
        break;

      case NAVIGATE_RESET:
        newState = trackRoute(action.actions[0]);
        break;
    }

    newState && dispatch(trackState(newState));
    return returnValue;
  };
}

function getNextTrackState(action, authState) {
  const routeName = action.routeName;
  const trackedRoute = trackableScreens[routeName];

  if (trackedRoute) {
    return trackedRoute.tracking;

  } else if (routeName === CONTACT_SCREEN) {
    return trackContactScreen(action, authState);

  } else if (routeName === DRAWER_OPEN) {
    const { params: actionParams = {} } = action;

    if (actionParams.drawer === CONTACT_MENU_DRAWER) {
      return trackContactMenu(actionParams.isCurrentUser);

    } else if (actionParams.drawer === MAIN_MENU_DRAWER) {
      return buildTrackingObj('menu', 'menu');
    }

  } else if (action.params && action.params.trackingObj) {
    //todo test trackingObj is ignored if screen is in trackableScreens
    return action.params.trackingObj;
  }
}

function trackRoute(route) {
  const trackedRoute = trackableScreens[route.routeName];
  if (trackedRoute) {
    return trackedRoute.tracking;
  }
}

function trackContactScreen(action, authState) { //steps tab is shown when ContactScreen first loads
  return action.params.person.id === authState.person.id ? SELF_STEPS : PERSON_STEPS;
}

function trackContactMenu(isCurrentUser) {
  return isCurrentUser ? buildTrackingObj('people : self : menu', 'people', 'self', 'menu')
    : buildTrackingObj('people : person : menu', 'people', 'person', 'menu');
}
