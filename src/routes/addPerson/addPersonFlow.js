import { createStackNavigator } from 'react-navigation';

import { NOTIFICATION_PROMPT_TYPES, MAIN_TABS } from '../../constants';
import { navigatePush, navigateReset } from '../../actions/navigation';
import { firstTime, loadHome } from '../../actions/auth/userData';
import {
  completeOnboarding,
  stashCommunityToJoin,
  joinStashedCommunity,
  landOnStashedCommunityScreen,
} from '../../actions/onboardingProfile';
import { showReminderOnLoad } from '../../actions/notifications';
import AddContactScreen, {
  ADD_CONTACT_SCREEN,
} from '../../containers/AddContactScreen';
import PersonStageScreen, {
  PERSON_STAGE_SCREEN,
} from '../../containers/PersonStageScreen';
import PersonSelectStepScreen, {
  PERSON_SELECT_STEP_SCREEN,
} from '../../containers/PersonSelectStepScreen';
import { buildTrackedScreen, wrapNextAction, wrapNextScreen } from '../helpers';
import { buildTrackingObj } from '../../utils/common';

export const AddPersonFlowScreens = {
  [ADD_CONTACT_SCREEN]: buildTrackedScreen(
    wrapNextAction(AddContactScreen, ({ person }) => (dispatch, getState) => {
      const {
        auth: {
          person: { id: myId },
        },
      } = getState();
      const { id: contactId, first_name: firstName } = person;

      const contactAssignment =
        (person.reverse_contact_assignments || []).find(
          a => a.assigned_to.id === myId,
        ) || {};
      const {
        id: contactAssignmentId,
        organization_id: orgId,
      } = contactAssignment;

      dispatch(
        navigatePush(PERSON_STAGE_SCREEN, {
          addingContactFlow: true,
          enableBackButton: false,
          currentStage: null,
          name: firstName,
          contactId,
          contactAssignmentId,
          section: 'people',
          subsection: 'person',
          orgId,
        }),
      );
    }),
    buildTrackingObj(),
  ),
  [PERSON_STAGE_SCREEN]: buildTrackedScreen(
    wrapNextAction(
      PersonStageScreen,
      ({ stage, name, contactId, orgId }) => dispatch => {
        dispatch(
          navigatePush(PERSON_SELECT_STEP_SCREEN, {
            contactStage: stage,
            createStepTracking: buildTrackingObj(
              'people : person : steps : create',
              'people',
              'person',
              'steps',
            ),
            contactName: name,
            contactId: contactId,
            organization: { id: orgId },
            trackingObj: buildTrackingObj(
              'people : person : steps : add',
              'people',
              'person',
              'steps',
            ),
          }),
        );
      },
    ),
    buildTrackingObj(),
  ),
  [PERSON_SELECT_STEP_SCREEN]: buildTrackedScreen(
    wrapNextAction(PersonSelectStepScreen, () => dispatch => {
      dispatch(navigateReset(MAIN_TABS, { startTab: 'people' }));
    }),
    buildTrackingObj(),
  ),
};
export const AddPersonFlowNavigator = createStackNavigator(
  AddPersonFlowScreens,
  {
    navigationOptions: {
      header: null,
    },
  },
);
