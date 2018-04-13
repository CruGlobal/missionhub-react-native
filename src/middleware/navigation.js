import { MainRoutes } from '../AppRoutes';
import { REHYDRATE } from 'redux-persist/constants';
import { isLoggedIn } from '../utils/common';
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
        let navState;

        const { auth, personProfile, people } = action.payload;

        if (auth && isLoggedIn(auth)) {
          if (!personProfile.hasCompletedOnboarding && !hasContactWithPathwayStage(auth.user.id, people)) {

            if (auth.user.user && auth.user.user.pathway_stage_id) {
              navState = addSomeoneState;

            } else {
              navState = getStartedState;
            }

          } else {
            navState = loggedInState;
          }

        } else {
          navState = initialState;
        }

        action.payload.navigation = navState;
    }

    return next(action);
  };
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
