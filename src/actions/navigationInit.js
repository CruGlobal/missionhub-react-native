import { isAuthenticated } from '../utils/common';
import { ADD_SOMEONE_SCREEN } from '../containers/AddSomeoneScreen';
import { GET_STARTED_SCREEN } from '../containers/GetStartedScreen';
import { MAIN_TABS } from '../constants';

import { navigateReset } from './navigation';
import { screenFlowClearAll, screenFlowStart } from './screenFlow';
import { AUTHENTICATE_FLOW } from './screenFlows/authenticateFlow';

export function setInitialRoute() {
  return (dispatch, getState) => {
    const { auth, personProfile, people } = getState();

    dispatch(screenFlowClearAll());

    if (auth && isAuthenticated(auth)) {
      if (
        personProfile.hasCompletedOnboarding ||
        hasContactWithPathwayStage(auth.person.id, people)
      ) {
        return dispatch(navigateReset(MAIN_TABS));
      }

      // TODO: start flow
      return auth.person.user.pathway_stage_id
        ? dispatch(navigateReset(ADD_SOMEONE_SCREEN))
        : dispatch(navigateReset(GET_STARTED_SCREEN));
    }

    return dispatch(screenFlowStart(AUTHENTICATE_FLOW));
  };
}

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
