import { isAuthenticated } from '../utils/common';
import { ADD_SOMEONE_SCREEN } from '../containers/AddSomeoneScreen';
import { GET_STARTED_SCREEN } from '../containers/GetStartedScreen';
import { LANDING_SCREEN } from '../containers/LandingScreen';
import { MAIN_TABS } from '../constants';

export function initialRoute({ auth, personProfile, people }) {
  if (auth && isAuthenticated(auth)) {
    if (
      personProfile.hasCompletedOnboarding ||
      hasContactWithPathwayStage(auth.person.id, people)
    ) {
      return MAIN_TABS;
    }

    return auth.person.user.pathway_stage_id && !personProfile.communityId
      ? ADD_SOMEONE_SCREEN
      : GET_STARTED_SCREEN;
  }

  return LANDING_SCREEN;
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
