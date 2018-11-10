import { isAuthenticated } from '../utils/common';
import { AUTHENTICATION_FLOW } from '../routes/constants';
import { ADD_SOMEONE_SCREEN } from '../containers/AddSomeoneScreen';
import { GET_STARTED_SCREEN } from '../containers/GetStartedScreen';
import { MAIN_TABS } from '../constants';

export function initialRoute({ auth, people }) {
  if (auth && isAuthenticated(auth)) {
    if (hasContactWithPathwayStage(auth.person.id, people)) {
      return MAIN_TABS;
    }

    return auth.person.user.pathway_stage_id
      ? ADD_SOMEONE_SCREEN
      : GET_STARTED_SCREEN;
  }

  return AUTHENTICATION_FLOW;
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
