/*  eslint max-lines-per-function: 0 */

import { createStackNavigator, StackActions } from 'react-navigation';

import { CREATE_STEP, PEOPLE_TAB } from '../../constants';
import {
  navigatePush,
  navigateBack,
  navigateToMainTabs,
} from '../../actions/navigation';
import { getOrganizationMembers } from '../../actions/organizations';
import { createCustomStep } from '../../actions/steps';
import AddContactScreen, {
  ADD_CONTACT_SCREEN,
} from '../../containers/AddContactScreen';
import SelectPersonStageScreen, {
  SELECT_PERSON_STAGE_SCREEN,
} from '../../containers/SelectPersonStageScreen';
import PersonSelectStepScreen, {
  PERSON_SELECT_STEP_SCREEN,
} from '../../containers/PersonSelectStepScreen';
import SuggestedStepDetailScreen, {
  SUGGESTED_STEP_DETAIL_SCREEN,
} from '../../containers/SuggestedStepDetailScreen';
import AddStepScreen, { ADD_STEP_SCREEN } from '../../containers/AddStepScreen';
import { wrapNextAction } from '../helpers';
import { paramsForStageNavigation } from '../utils';
import { buildTrackingObj } from '../../utils/common';

export const AddPersonFlowScreens = onFlowComplete => ({
  [ADD_CONTACT_SCREEN]: wrapNextAction(
    AddContactScreen,
    ({ person, orgId, didSavePerson }) => (dispatch, getState) => {
      if (!didSavePerson) {
        return dispatch(navigateBack());
      }

      const { id: contactId } = person;
      const { assignment, firstName } = paramsForStageNavigation(
        contactId,
        orgId,
        getState,
      );

      dispatch(
        navigatePush(SELECT_PERSON_STAGE_SCREEN, {
          enableBackButton: false,
          firstName,
          contactId,
          contactAssignmentId: assignment && assignment.id,
          section: 'people',
          subsection: 'person',
          orgId,
        }),
      );
    },
  ),
  [SELECT_PERSON_STAGE_SCREEN]: wrapNextAction(
    SelectPersonStageScreen,
    ({ stage, firstName, contactId, orgId }) => dispatch => {
      dispatch(
        navigatePush(PERSON_SELECT_STEP_SCREEN, {
          contactStage: stage,
          createStepTracking: buildTrackingObj(
            'people : person : steps : create',
            'people',
            'person',
            'steps',
          ),
          contactName: firstName,
          contactId,
          organization: { id: orgId },
          enableSkipButton: true,
        }),
      );
    },
  ),
  [PERSON_SELECT_STEP_SCREEN]: wrapNextAction(
    PersonSelectStepScreen,
    ({ receiverId, step, orgId }) =>
      step
        ? navigatePush(SUGGESTED_STEP_DETAIL_SCREEN, {
            step,
            receiverId,
            orgId,
          })
        : navigatePush(ADD_STEP_SCREEN, {
            type: CREATE_STEP,
            personId: receiverId,
            orgId,
            trackingObj: buildTrackingObj(
              'people : person : steps : create',
              'people',
              'person',
              'steps',
            ),
          }),
  ),
  [SUGGESTED_STEP_DETAIL_SCREEN]: wrapNextAction(
    SuggestedStepDetailScreen,
    ({ orgId }) => onFlowComplete({ orgId }),
  ),
  [ADD_STEP_SCREEN]: wrapNextAction(
    AddStepScreen,
    ({ text, personId, orgId }) => dispatch => {
      dispatch(createCustomStep(text, personId, orgId));
      dispatch(onFlowComplete({ orgId }));
    },
  ),
});

export const AddPersonThenStepScreenFlowNavigator = createStackNavigator(
  AddPersonFlowScreens(() => navigateToMainTabs()),
  {
    defaultNavigationOptions: {
      header: null,
    },
  },
);

export const AddPersonThenPeopleScreenFlowNavigator = createStackNavigator(
  AddPersonFlowScreens(() => navigateToMainTabs(PEOPLE_TAB)),
  {
    defaultNavigationOptions: {
      header: null,
    },
  },
);

export const AddPersonThenCommunityMembersFlowNavigator = createStackNavigator(
  AddPersonFlowScreens(({ orgId }) => dispatch => {
    dispatch(getOrganizationMembers(orgId));
    dispatch(StackActions.popToTop());
    dispatch(StackActions.pop());
  }),
  {
    defaultNavigationOptions: {
      header: null,
    },
  },
);
