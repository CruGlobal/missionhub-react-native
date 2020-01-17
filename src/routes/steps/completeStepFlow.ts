// eslint-disable-next-line import/named
import { StackActions } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import { wrapNextAction } from '../helpers';
import { navigatePush } from '../../actions/navigation';
import { reloadJourney } from '../../actions/journey';
import { RESET_STEP_COUNT, ACTIONS } from '../../constants';
import AddStepScreen, {
  COMPLETE_STEP_SCREEN,
} from '../../containers/AddStepScreen';
import { SELECT_STAGE_SCREEN } from '../../containers/SelectStageScreen';
import CelebrationScreen, {
  CELEBRATION_SCREEN,
} from '../../containers/CelebrationScreen';
import { updateChallengeNote } from '../../actions/steps';
import { trackAction } from '../../actions/analytics';
import { SelectMyStageFlowScreens } from '../stage/selectMyStageFlow';
import { SelectPersonStageFlowScreens } from '../stage/selectPersonStageFlow';
import { paramsForStageNavigation } from '../utils';

// @ts-ignore
export const CompleteStepFlowScreens = onFlowComplete => ({
  [COMPLETE_STEP_SCREEN]: wrapNextAction(
    AddStepScreen,
    ({ text, id, personId, orgId }) => (dispatch, getState) => {
      const {
        hasHitCount,
        isNotSure,
        subsection,
        firstItemIndex,
        questionText,
      } = paramsForStageNavigation(personId, orgId, getState);

      if (text) {
        dispatch(updateChallengeNote(id, text));
        dispatch(
          trackAction(ACTIONS.INTERACTION.name, {
            [ACTIONS.INTERACTION.COMMENT]: null,
          }),
        );
      }

      // If person hasn't hit the count and they're NOT on the "not sure" stage
      // Send them through to celebrate and complete
      if (!hasHitCount && !isNotSure) {
        return dispatch(
          navigatePush(CELEBRATION_SCREEN, { personId: personId, orgId }),
        );
      }

      if (isNotSure) {
        // Reset the user's step count so we don't show the wrong message once they hit 3 completed steps
        dispatch({ type: RESET_STEP_COUNT, userId: personId });
      }

      dispatch(
        navigatePush(SELECT_STAGE_SCREEN, {
          section: 'people',
          subsection,
          selectedStageId: firstItemIndex,
          enableBackButton: false,
          questionText,
          orgId,
          personId,
        }),
      );
    },
  ),
  ...SelectMyStageFlowScreens,
  ...SelectPersonStageFlowScreens,
  [CELEBRATION_SCREEN]: wrapNextAction(
    CelebrationScreen,
    ({ personId, orgId }) => dispatch => {
      dispatch(reloadJourney(personId, orgId));
      dispatch(StackActions.popToTop());

      dispatch(StackActions.pop({ immediate: true }));
      onFlowComplete && dispatch(onFlowComplete());
    },
  ),
});

export const CompleteStepFlowNavigator = createStackNavigator(
  // @ts-ignore
  CompleteStepFlowScreens(),
  {
    defaultNavigationOptions: {
      header: null,
    },
  },
);

export const CompleteStepFlowAndNavigateBackNavigator = createStackNavigator(
  CompleteStepFlowScreens(() => StackActions.pop({ immediate: true })),
  {
    defaultNavigationOptions: {
      header: null,
    },
  },
);
