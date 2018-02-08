import { trackState } from '../actions/analytics';
import { trackableScreens } from '../AppRoutes';
import { CONTACT_SCREEN } from '../containers/ContactScreen';
import { PERSON_STEPS, SELF_STEPS } from '../components/ContactHeader';
import { DRAWER_OPEN } from '../constants';

export default function tracking({ dispatch, getState }) {
  return (next) => (action) => {
    const returnValue = next(action);

    if (action.type === 'Navigation/NAVIGATE') {
      const routeName = action.routeName;
      const route = trackableScreens[routeName];

      if (route) {
        dispatch(trackState(route.name));

      } else if (routeName === CONTACT_SCREEN) {
        dispatch(trackContactScreen(action, getState));

      } else if (routeName === DRAWER_OPEN && action.params.isCurrentUser !== undefined) {
        dispatch(trackContactMenu(action.params.isCurrentUser));
      }

    } else if (action.type === 'Navigation/BACK') {
      // const screen = getState().analytics[ANALYTICS.PREVIOUS_SCREENNAME];
      // dispatch(trackState(screen));

    } else if (action.type === 'Navigation/RESET') {
      //todo handle
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
