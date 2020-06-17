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
import AddStepScreen, { ADD_STEP_SCREEN } from '../../containers/AddStepScreen';
import { wrapNextAction, NextAction } from '../helpers';
import PersonCategoryScreen, {
  PERSON_CATEGORY_SCREEN,
} from '../../containers/PersonCategoryScreen';

export const AddPersonFlowScreens = (onFlowComplete: NextAction) => ({
  [ADD_CONTACT_SCREEN]: wrapNextAction(
    AddContactScreen,
    ({ personId, relationshipType, orgId, didSavePerson }) => dispatch => {
      if (!didSavePerson) {
        return dispatch(navigateBack());
      }

      dispatch(
        navigatePush(PERSON_CATEGORY_SCREEN, {
          personId,
          relationshipType,
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
    ({
      personId,
      stepSuggestionId,
      stepType,
      orgId,
      skip,
    }: SelectStepScreenNextProps) =>
      skip
        ? onFlowComplete()
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
    () => onFlowComplete(),
  ),
  [ADD_STEP_SCREEN]: wrapNextAction(AddStepScreen, () => onFlowComplete()),
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
  AddPersonFlowScreens(() => dispatch => {
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
