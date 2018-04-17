import { MainRoutes } from '../AppRoutes';
import { REHYDRATE } from 'redux-persist/constants';
import { isAuthenticated } from '../utils/common';
import { ADD_SOMEONE_SCREEN } from '../containers/AddSomeoneScreen';
import { GET_STARTED_SCREEN } from '../containers/GetStartedScreen';
import { MAIN_TABS } from '../constants';
import { LOGIN_SCREEN } from '../containers/LoginScreen';
import { NavigationActions } from 'react-navigation';

const initialState = MainRoutes.router.getStateForAction(MainRoutes.router.getActionForPathAndParams(LOGIN_SCREEN));
const addSomeoneState = MainRoutes.router.getStateForAction(MainRoutes.router.getActionForPathAndParams(ADD_SOMEONE_SCREEN));
const getStartedState = MainRoutes.router.getStateForAction(MainRoutes.router.getActionForPathAndParams(GET_STARTED_SCREEN));

const loggedInState = MainRoutes.router.getStateForAction(NavigationActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: MAIN_TABS }),
  ],
}));

export default function navigation() {
  return (next) => (action) => {
    switch (action.type) {
      case REHYDRATE:
        action.payload.navigation = getNavState(action.payload);
    }

    return next(action);
  };
}

function getNavState({ auth, personProfile, people }) {
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
