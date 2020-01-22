import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { isAuthenticated } from '../utils/common';
import {
  ADD_SOMEONE_ONBOARDING_FLOW,
  GET_STARTED_ONBOARDING_FLOW,
} from '../routes/constants';
import { LANDING_SCREEN } from '../containers/LandingScreen';
import { AuthState } from '../reducers/auth';
import { OnboardingState } from '../reducers/onboarding';
import { PeopleState, Person } from '../reducers/people';
import { Organization } from '../reducers/organizations';
import { NotificationsState } from '../reducers/notifications';
import { RELOAD_APP, NOTIFICATION_PROMPT_TYPES } from '../constants';

import { navigateReset, navigateToMainTabs } from './navigation';
import { startOnboarding } from './onboarding';
import { checkNotifications } from './notifications';

export const resetToInitialRoute = () => (
  dispatch: ThunkDispatch<
    { auth: AuthState; notifications: NotificationsState },
    {},
    AnyAction
  >,
  getState: () => {
    auth: AuthState;
    onboarding: OnboardingState;
    people: PeopleState;
  },
) => {
  dispatch({ type: RELOAD_APP });

  const { auth, onboarding, people } = getState();
  if (auth && isAuthenticated(auth)) {
    if (
      onboarding.skippedAddingPerson ||
      hasContactWithPathwayStage(auth.person.id, people)
    ) {
      dispatch(navigateToMainTabs());
      return dispatch(checkNotifications(NOTIFICATION_PROMPT_TYPES.LOGIN));
    }

    dispatch(startOnboarding());
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

function hasContactWithPathwayStage(myId: string, people: PeopleState) {
  return Object.values(people.allByOrg).some((org: Organization) =>
    Object.values(org.people).some(
      (person: Person) =>
        person.id !== myId &&
        person.reverse_contact_assignments.some(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (assignment: any) =>
            assignment.assigned_to.id === myId && assignment.pathway_stage_id,
        ),
    ),
  );
}
