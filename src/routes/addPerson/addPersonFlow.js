/*  eslint max-lines-per-function: 0 */

import { createStackNavigator, StackActions } from 'react-navigation';

import { MAIN_TABS, PEOPLE_TAB } from '../../constants';
import {
  navigatePush,
  navigateReset,
  navigateToMainTabs,
} from '../../actions/navigation';
import { getOrganizationMembers } from '../../actions/organizations';
import AddContactScreen, {
  ADD_CONTACT_SCREEN,
} from '../../containers/AddContactScreen';
import PersonStageScreen, {
  PERSON_STAGE_SCREEN,
} from '../../containers/PersonStageScreen';
import PersonSelectStepScreen, {
  PERSON_SELECT_STEP_SCREEN,
} from '../../containers/PersonSelectStepScreen';
import { buildTrackedScreen, wrapNextAction } from '../helpers';
import { buildTrackingObj } from '../../utils/common';

export const AddPersonFlowScreens = onFlowComplete => ({
  [ADD_CONTACT_SCREEN]: buildTrackedScreen(
    wrapNextAction(
      AddContactScreen,
      ({ person, orgId, didSavePerson }) => (dispatch, getState) => {
        if (!didSavePerson) {
          return dispatch(onFlowComplete({ orgId }));
        }

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
        const { id: contactAssignmentId } = contactAssignment;

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
      },
    ),
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
            enableBackButton: false,
            enableSkipButton: true,
          }),
        );
      },
    ),
    buildTrackingObj(),
  ),
  [PERSON_SELECT_STEP_SCREEN]: buildTrackedScreen(
    wrapNextAction(PersonSelectStepScreen, ({ orgId }) => dispatch => {
      dispatch(onFlowComplete({ orgId }));
    }),
    buildTrackingObj(),
  ),
});

export const AddPersonThenStepScreenFlowNavigator = createStackNavigator(
  AddPersonFlowScreens(() => navigateToMainTabs()),
  {
    navigationOptions: {
      header: null,
    },
  },
);

export const AddPersonThenPeopleScreenFlowNavigator = createStackNavigator(
  AddPersonFlowScreens(() => navigateToMainTabs(PEOPLE_TAB)),
  {
    navigationOptions: {
      header: null,
    },
  },
);

export const AddPersonThenCommunityMembersFlowNavigator = createStackNavigator(
  AddPersonFlowScreens(({ orgId }) => dispatch => {
    dispatch(getOrganizationMembers(orgId));
    dispatch(StackActions.popToTop());
    dispatch(StackActions.pop({ immediate: true }));
  }),
  {
    navigationOptions: {
      header: null,
    },
  },
);
