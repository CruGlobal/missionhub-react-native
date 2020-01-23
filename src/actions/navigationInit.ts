import { isAuthenticated } from '../utils/common';
import {
  ADD_SOMEONE_ONBOARDING_FLOW,
  GET_STARTED_ONBOARDING_FLOW,
} from '../routes/constants';
import { LANDING_SCREEN } from '../containers/LandingScreen';

import { navigateReset, navigateToMainTabs } from './navigation';

// @ts-ignore
export const resetToInitialRoute = () => (dispatch, getState) => {
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

// @ts-ignore
function hasContactWithPathwayStage(myId, people) {
  return Object.values(people.allByOrg).some(org =>
    // @ts-ignore
    Object.values(org.people).some(
      person =>
        // @ts-ignore
        person.id !== myId &&
        // @ts-ignore
        person.reverse_contact_assignments.some(
          // @ts-ignore
          assignment =>
            assignment.assigned_to.id === myId && assignment.pathway_stage_id,
        ),
    ),
  );
}
