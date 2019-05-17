import { isAuthenticated } from '../utils/common';
import { ADD_SOMEONE_SCREEN } from '../containers/AddSomeoneScreen';
import { GET_STARTED_SCREEN } from '../containers/GetStartedScreen';
import { LANDING_SCREEN } from '../containers/LandingScreen';

import { navigateReset, navigateToMainTabs } from './navigation';

export const resetToInitialRoute = () => (dispatch, getState) => {
  const { auth, personProfile, people } = getState();
  if (auth && isAuthenticated(auth)) {
    if (
      personProfile.hasCompletedOnboarding ||
      hasContactWithPathwayStage(auth.person.id, people)
    ) {
      return dispatch(navigateToMainTabs());
    }

    return dispatch(
      navigateReset(
        auth.person.user.pathway_stage_id
          ? ADD_SOMEONE_SCREEN
          : GET_STARTED_SCREEN,
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
