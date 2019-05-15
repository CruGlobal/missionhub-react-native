/*  eslint max-lines-per-function: 0 */

import { createStackNavigator, StackActions } from 'react-navigation';

import { PEOPLE_TAB } from '../../constants';
import { navigatePush, navigateToMainTabs } from '../../actions/navigation';
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
import { wrapNextAction } from '../helpers';
import { paramsForStageNavigation } from '../utils';
import { buildTrackingObj } from '../../utils/common';

export const AddPersonFlowScreens = onFlowComplete => ({
  [ADD_CONTACT_SCREEN]: wrapNextAction(
    AddContactScreen,
    ({ person, orgId, didSavePerson }) => (dispatch, getState) => {
      if (!didSavePerson) {
        return dispatch(StackActions.pop({ immediate: true }));
      }

      const { id: contactId } = person;
      const { assignment, name } = paramsForStageNavigation(
        contactId,
        orgId,
        getState,
      );

      dispatch(
        navigatePush(PERSON_STAGE_SCREEN, {
          addingContactFlow: true,
          enableBackButton: false,
          currentStage: null,
          name,
          contactId,
          contactAssignmentId: assignment && assignment.id,
          section: 'people',
          subsection: 'person',
          orgId,
        }),
      );
    },
  ),
  [PERSON_STAGE_SCREEN]: wrapNextAction(
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
          contactId,
          organization: { id: orgId },
          enableBackButton: false,
          enableSkipButton: true,
        }),
      );
    },
  ),
  [PERSON_SELECT_STEP_SCREEN]: wrapNextAction(
    PersonSelectStepScreen,
    ({ orgId }) => dispatch => {
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
  }),
  {
    defaultNavigationOptions: {
      header: null,
    },
  },
);
