import { NavigationActions } from 'react-navigation';
import { REHYDRATE } from 'redux-persist/constants';
import { MainRoutes } from '../AppRoutes';
import { LOGIN_SCREEN } from '../containers/LoginScreen';
import { MAIN_TABS } from '../constants';
import { isLoggedIn } from '../utils/common';
import { ADD_SOMEONE_SCREEN } from '../containers/AddSomeoneScreen';
import { GET_STARTED_SCREEN } from '../containers/GetStartedScreen';

const initialState = MainRoutes.router.getStateForAction(MainRoutes.router.getActionForPathAndParams(LOGIN_SCREEN));

const loggedInState = MainRoutes.router.getStateForAction(NavigationActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: MAIN_TABS }),
  ],
}));

const addSomeoneState = MainRoutes.router.getStateForAction(MainRoutes.router.getActionForPathAndParams(ADD_SOMEONE_SCREEN));
const getStartedState = MainRoutes.router.getStateForAction(MainRoutes.router.getActionForPathAndParams(GET_STARTED_SCREEN));

function navReducer(state = initialState, action) {
  let nextState;

  switch (action.type) {
    case REHYDRATE:
      const { auth, personProfile, people } = action.payload;

      if (auth && isLoggedIn(auth)) {
        if (!personProfile.hasCompletedOnboarding && !hasContactWithPathwayStage(auth.user.id, people)) {

          if (auth.user.user && auth.user.user.pathway_stage_id) {
            return addSomeoneState;
          }

          return getStartedState;
        }

        return loggedInState;
      }

      return state;

    default:
      nextState = MainRoutes.router.getStateForAction(action, state);
  }

  return nextState || state;
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

export default navReducer;
