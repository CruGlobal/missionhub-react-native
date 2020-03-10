/*  eslint max-lines-per-function: 0 */

// eslint-disable-next-line import/named
import { StackActions } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

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
import SelectStageScreen, {
  SELECT_STAGE_SCREEN,
} from '../../containers/SelectStageScreen';
import SelectStepScreen, {
  SELECT_STEP_SCREEN,
} from '../../containers/SelectStepScreen';
import SuggestedStepDetailScreen, {
  SUGGESTED_STEP_DETAIL_SCREEN,
} from '../../containers/SuggestedStepDetailScreen';
import AddStepScreen, { ADD_STEP_SCREEN } from '../../containers/AddStepScreen';
import { wrapNextAction } from '../helpers';
import PersonCategoryScreen, {
  PERSON_CATEGORY_SCREEN,
} from '../../containers/PersonCategoryScreen';

// @ts-ignore
export const AddPersonFlowScreens = onFlowComplete => ({
  [ADD_CONTACT_SCREEN]: wrapNextAction(
    AddContactScreen,
    ({ person, orgId, didSavePerson }) => dispatch => {
      if (!didSavePerson) {
        return dispatch(navigateBack());
      }

      dispatch(
        navigatePush(PERSON_CATEGORY_SCREEN, {
          person,
          orgId,
        }),
      );
    },
  ),
  [PERSON_CATEGORY_SCREEN]: wrapNextAction(
    PersonCategoryScreen,
    ({ personId, orgId }: { personId: string; orgId: string }) => dispatch => {
      dispatch(
        navigatePush(SELECT_STAGE_SCREEN, {
          enableBackButton: false,
          personId,
          section: 'people',
          subsection: 'person',
          orgId,
        }),
      );
    },
  ),
  [SELECT_STAGE_SCREEN]: wrapNextAction(
    SelectStageScreen,
    ({ personId, orgId }) => dispatch => {
      dispatch(
        navigatePush(SELECT_STEP_SCREEN, {
          personId,
          orgId,
          enableSkipButton: true,
        }),
      );
    },
  ),
  [SELECT_STEP_SCREEN]: wrapNextAction(
    SelectStepScreen,
    ({ personId, step, orgId, skip }) =>
      skip
        ? onFlowComplete({ orgId })
        : step
        ? navigatePush(SUGGESTED_STEP_DETAIL_SCREEN, {
            step,
            personId,
            orgId,
          })
        : navigatePush(ADD_STEP_SCREEN, {
            type: CREATE_STEP,
            personId,
            orgId,
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
  // @ts-ignore
  AddPersonFlowScreens(({ orgId }) => dispatch => {
    dispatch(getOrganizationMembers(orgId));
    dispatch(StackActions.popToTop());
    // @ts-ignore
    dispatch(StackActions.pop());
  }),
  {
    defaultNavigationOptions: {
      header: null,
    },
  },
);
