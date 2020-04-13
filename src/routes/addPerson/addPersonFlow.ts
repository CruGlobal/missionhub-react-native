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
import AddContactScreen, {
  ADD_CONTACT_SCREEN,
} from '../../containers/AddContactScreen';
import SelectStageScreen, {
  SELECT_STAGE_SCREEN,
} from '../../containers/SelectStageScreen';
import SelectStepScreen, {
  SELECT_STEP_SCREEN,
  SelectStepScreenNextProps,
} from '../../containers/SelectStepScreen';
import SuggestedStepDetailScreen, {
  SUGGESTED_STEP_DETAIL_SCREEN,
} from '../../containers/SuggestedStepDetailScreen';
import AddStepScreen, {
  ADD_STEP_SCREEN,
  AddStepScreenNextProps,
} from '../../containers/AddStepScreen';
import { wrapNextAction } from '../helpers';

// @ts-ignore
export const AddPersonFlowScreens = onFlowComplete => ({
  [ADD_CONTACT_SCREEN]: wrapNextAction(
    AddContactScreen,
    ({ person, orgId, didSavePerson }) => dispatch => {
      if (!didSavePerson) {
        return dispatch(navigateBack());
      }

      const { id: personId } = person;

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
    ({
      personId,
      stepSuggestionId,
      stepType,
      orgId,
      skip,
    }: SelectStepScreenNextProps) =>
      skip
        ? onFlowComplete({ orgId })
        : stepSuggestionId
        ? navigatePush(SUGGESTED_STEP_DETAIL_SCREEN, {
            stepSuggestionId,
            personId,
            orgId,
          })
        : navigatePush(ADD_STEP_SCREEN, {
            type: CREATE_STEP,
            stepType,
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
    ({ orgId }: AddStepScreenNextProps) => dispatch => {
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
