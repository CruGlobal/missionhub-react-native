import { NavigationActions } from 'react-navigation';

import { MainRoutes } from '../AppRoutes';
import { isAuthenticated } from '../utils/common';
import { ADD_SOMEONE_SCREEN } from '../containers/AddSomeoneScreen';
import { GET_STARTED_SCREEN } from '../containers/GetStartedScreen';
import { MAIN_TABS } from '../constants';
import { LOGIN_SCREEN } from '../containers/LoginScreen';

export function navigationInit({ auth, personProfile, people }) {
  const initialState = MainRoutes.router.getActionForPathAndParams(LOGIN_SCREEN);
  const addSomeoneState = MainRoutes.router.getActionForPathAndParams(ADD_SOMEONE_SCREEN);
  const getStartedState = MainRoutes.router.getActionForPathAndParams(GET_STARTED_SCREEN);

  const loggedInState = NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({ routeName: MAIN_TABS }),
    ],
  });

  if (auth && isAuthenticated(auth)) {
    if (personProfile.hasCompletedOnboarding || hasContactWithPathwayStage(auth.person.id, people)) {
      return loggedInState;
    }

    return auth.person.user.pathway_stage_id ? addSomeoneState : getStartedState;
  }

  return initialState;
}

function hasContactWithPathwayStage(myId, people) {
  return Object.values(people.allByOrg).some((org) =>
    Object.values(org.people).some((person) =>
      person.id !== myId && person.reverse_contact_assignments.some((assignment) =>
        assignment.assigned_to.id === myId && assignment.pathway_stage_id
      )
    )
  );
}
