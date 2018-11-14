import { createStackNavigator } from 'react-navigation';

import { buildTrackingObj } from '../../../utils/common';
import AddStepScreen, {
  ADD_STEP_SCREEN,
} from '../../../containers/AddStepScreen';
import { wrapNextAction } from '../../helpers';
import { ACTIONS, STEP_NOTE } from '../../../constants';
import { trackAction } from '../../../actions/analytics';
import { updateChallengeNote } from '../../../actions/steps';
import {
  navigate,
  navigatePush,
  navigateBack,
} from '../../../actions/navigation';
import CelebrationScreen, {
  CELEBRATION_SCREEN,
} from '../../../containers/CelebrationScreen';
import { STEPS_SCREEN } from '../../../containers/StepsScreen';
import StageScreen, { STAGE_SCREEN } from '../../../containers/StageScreen';
import { reloadJourney } from '../../../actions/journey';

export const CompleteStepFlowScreens = {
  [ADD_STEP_SCREEN]: {
    screen: wrapNextAction(
      AddStepScreen,
      ({ personId, orgId, stepId, text }) => async (dispatch, getState) => {
        if (text) {
          await dispatch(updateChallengeNote(stepId, text));
          dispatch(
            trackAction(ACTIONS.INTERACTION.name, {
              [ACTIONS.INTERACTION.COMMENT]: null,
            }),
          );
        }

        // If completed 3 steps with a given person
        if (getState().steps.userStepCount[personId] % 3 === 0) {
          dispatch(
            navigatePush(STAGE_SCREEN, {
              personId,
              orgId,
            }),
          );
        } else {
          dispatch(navigatePush(CELEBRATION_SCREEN));
        }
      },
      { type: STEP_NOTE },
    ),
    trackingObj: buildTrackingObj(
      ['people', 'person', 'steps'], // TODO: use - const subsection = getAnalyticsSubsection(step.receiver.id, myId);
      'complete comment',
    ),
  },
  [STAGE_SCREEN]: {
    screen: wrapNextAction(
      StageScreen,
      (personId, orgId) => dispatch => {
        dispatch(navigatePush(CELEBRATION_SCREEN));
        dispatch(reloadJourney(personId, orgId));
      },
      { completed3Steps: true },
    ),
  },
  [CELEBRATION_SCREEN]: {
    screen: wrapNextAction(CelebrationScreen, () => dispatch =>
      dispatch(navigateBack(1, null)),
    ),
    trackingObj: buildTrackingObj(['people', 'person', 'steps'], 'gif'), // TODO: use - const subsection = getAnalyticsSubsection(step.receiver.id, myId);
  },
};

export const CompleteStepFlowNavigator = createStackNavigator(
  CompleteStepFlowScreens,
  {
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
);
