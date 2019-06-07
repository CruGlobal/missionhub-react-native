import { createStackNavigator, StackActions } from 'react-navigation';

import { wrapNextAction } from '../helpers';
import { navigatePush } from '../../actions/navigation';
import { reloadJourney } from '../../actions/journey';
import { RESET_STEP_COUNT, ACTIONS } from '../../constants';
import AddStepScreen, {
  COMPLETE_STEP_SCREEN,
} from '../../containers/AddStepScreen';
import { STAGE_SCREEN } from '../../containers/StageScreen';
import { PERSON_STAGE_SCREEN } from '../../containers/PersonStageScreen';
import CelebrationScreen, {
  CELEBRATION_SCREEN,
} from '../../containers/CelebrationScreen';
import { updateChallengeNote } from '../../actions/steps';
import { trackAction } from '../../actions/analytics';
import { SelectMyStageFlowScreens } from '../stage/selectMyStageFlow';
import { SelectPersonStageFlowScreens } from '../stage/selectPersonStageFlow';
import { paramsForStageNavigation } from '../utils';

export const CompleteStepFlowScreens = onFlowComplete => ({
  [COMPLETE_STEP_SCREEN]: wrapNextAction(
    AddStepScreen,
    ({ text, stepId, personId, orgId }) => (dispatch, getState) => {
      const {
        isMe,
        hasHitCount,
        isNotSure,
        subsection,
        firstItemIndex,
        questionText,
        assignment,
        name,
      } = paramsForStageNavigation(personId, orgId, getState);

      if (text) {
        dispatch(updateChallengeNote(stepId, text));
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
          navigatePush(CELEBRATION_SCREEN, { contactId: personId, orgId }),
        );
      }

      if (isNotSure) {
        // Reset the user's step count so we don't show the wrong message once they hit 3 completed steps
        dispatch({ type: RESET_STEP_COUNT, userId: personId });
      }

      dispatch(
        navigatePush(isMe ? STAGE_SCREEN : PERSON_STAGE_SCREEN, {
          section: 'people',
          subsection,
          firstItem: firstItemIndex,
          enableBackButton: false,
          questionText,
          orgId,
          contactId: personId,
          contactAssignmentId: assignment && assignment.id,
          name,
        }),
      );
    },
  ),
  ...SelectMyStageFlowScreens,
  ...SelectPersonStageFlowScreens,
  [CELEBRATION_SCREEN]: wrapNextAction(
    CelebrationScreen,
    ({ contactId, orgId }) => dispatch => {
      dispatch(reloadJourney(contactId, orgId));
      dispatch(StackActions.popToTop());

      dispatch(StackActions.pop({ immediate: true }));
      onFlowComplete && dispatch(onFlowComplete());
    },
  ),
});

export const CompleteStepFlowNavigator = createStackNavigator(
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
