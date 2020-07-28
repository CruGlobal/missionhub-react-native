import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { isAuthenticated } from '../utils/common';
import { GET_STARTED_ONBOARDING_FLOW } from '../routes/constants';
import { LANDING_SCREEN } from '../containers/LandingScreen';
import { RootState } from '../reducers';
import { RELOAD_APP, NOTIFICATION_PROMPT_TYPES } from '../constants';

import { navigateReset, navigateToMainTabs } from './navigation';
import { startOnboarding } from './onboarding';
import { checkNotifications } from './notifications';

export const resetToInitialRoute = (preservePreviousScreen = false) => (
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
  getState: () => RootState,
) => {
  !preservePreviousScreen && dispatch({ type: RELOAD_APP });

  const { auth } = getState();

  if (!isAuthenticated(auth)) {
    return dispatch(navigateReset(LANDING_SCREEN));
  }
  if (!auth.person?.user?.pathway_stage_id) {
    dispatch(startOnboarding());
    return dispatch(navigateReset(GET_STARTED_ONBOARDING_FLOW));
  }
  dispatch(navigateToMainTabs());
  return dispatch(checkNotifications(NOTIFICATION_PROMPT_TYPES.LOGIN));
};
