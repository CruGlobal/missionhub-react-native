import { trackState } from '../actions/analytics';
import { screens } from '../AppRoutes';
import { ANALYTICS } from '../constants';

export default function tracking({ dispatch, getState }) {
  return (next) => (action) => {
    const returnValue = next(action);

    if (action.type === 'Navigation/NAVIGATE') {
      const route = screens[action.routeName];

      if (route) {
        dispatch(trackState(route.name));
      }

    } else if (action.type === 'Navigation/BACK') {
      const screen = getState().analytics[ANALYTICS.PREVIOUS_SCREENNAME];
      dispatch(trackState(screen));

    } else if (action.type === 'Navigation/RESET') {
      //todo handle
    }

    return returnValue;
  };
}