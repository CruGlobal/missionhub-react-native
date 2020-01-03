import { isAuthenticated } from '../utils/common';
import {
  ADD_SOMEONE_ONBOARDING_FLOW,
  GET_STARTED_ONBOARDING_FLOW,
} from '../routes/constants';
import { LANDING_SCREEN } from '../containers/LandingScreen';
import { RELOAD_APP } from '../constants';

import { navigateReset, navigateToMainTabs } from './navigation';

export const resetToInitialRoute = () => (dispatch, getState) => {
  dispatch({ type: RELOAD_APP });
  const { auth, onboarding, people } = getState();
  if (auth && isAuthenticated(auth)) {
    if (
      onboarding.skippedAddingPerson ||
      hasContactWithPathwayStage(auth.person.id, people)
    ) {
      return dispatch(navigateToMainTabs());
    }

    return dispatch(
      navigateReset(
        auth.person.user.pathway_stage_id
          ? ADD_SOMEONE_ONBOARDING_FLOW
          : GET_STARTED_ONBOARDING_FLOW,
      ),
    );
  }

  dispatch(navigateReset(LANDING_SCREEN));
};

function hasContactWithPathwayStage(myId, people) {
  return Object.values(people.allByOrg).some(org =>
    Object.values(org.people).some(
      person =>
        person.id !== myId &&
        person.reverse_contact_assignments.some(
          assignment =>
            assignment.assigned_to.id === myId && assignment.pathway_stage_id,
        ),
    ),
  );
}
