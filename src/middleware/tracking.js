import { trackState } from '../actions/analytics';
import { trackableScreens } from '../AppRoutes';
import { CONTACT_SCREEN } from '../containers/ContactScreen';
import { PERSON_STEPS, SELF_STEPS } from '../components/ContactHeader';
import {
  CONTACT_MENU_DRAWER, CONTACT_TAB_CHANGED,
  DRAWER_OPEN, IMPACT_TAB,
  MAIN_MENU_DRAWER,
  MAIN_TAB_CHANGED, MAIN_TABS, NAVIGATE_BACK,
  NAVIGATE_FORWARD, NAVIGATE_POP,
  NAVIGATE_RESET, PEOPLE_TAB, STEPS_TAB,
} from '../constants';
import { buildTrackingObj } from '../utils/common';

export default function tracking({ dispatch, getState }) {
  return (next) => (action) => {
    let newState;
    const returnValue = next(action);
    const { nav: navState, auth: authState, tabs: tabsState } = getState();

    switch (action.type) {
      case NAVIGATE_FORWARD:
        newState = getNextTrackState(action, authState, dispatch);

        if (action.routeName === STEPS_TAB || action.routeName === PEOPLE_TAB || action.routeName === IMPACT_TAB) {
          dispatch({ type: MAIN_TAB_CHANGED, newActiveTab: newState });
        }
        break;

      case NAVIGATE_BACK:
      case NAVIGATE_POP:
        const routes = navState.routes;
        const topRoute = routes[routes.length - 1];

        if (topRoute.routeName === MAIN_TABS) {
          newState = tabsState.activeMainTab;
          break;
        }

        if (topRoute.routeName === CONTACT_SCREEN) {
          newState = tabsState.activeContactTab;
          break;
        }

        newState = getNextTrackState(topRoute, authState, () => {});
        break;

      case NAVIGATE_RESET:
        newState = trackRoute(action.actions[0]);
        break;
    }

    newState && dispatch(trackState(newState));
    return returnValue;
  };
}

function getNextTrackState(action, authState, dispatch) {
  const routeName = action.routeName;
  const trackedRoute = trackableScreens[routeName];

  if (trackedRoute) {
    return trackedRoute.tracking;

  } else if (routeName === CONTACT_SCREEN) {
    return trackContactScreen(action, authState, dispatch);

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

function trackContactScreen(action, authState, dispatch) { //steps tab is shown when ContactScreen first loads
  const data = action.params.person.id === authState.person.id ? SELF_STEPS : PERSON_STEPS;
  dispatch({ type: CONTACT_TAB_CHANGED, newActiveTab: data });
  return data;
}

function trackContactMenu(isCurrentUser) {
  return isCurrentUser ? buildTrackingObj('people : self : menu', 'people', 'self', 'menu')
    : buildTrackingObj('people : person : menu', 'people', 'person', 'menu');
}
