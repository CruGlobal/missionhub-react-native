import { createStackNavigator } from 'react-navigation';

import { buildTrackingObj } from '../../../utils/common';
import AddStepScreen, {
  ADD_STEP_SCREEN,
} from '../../../containers/AddStepScreen';
import { wrapNextAction } from '../../helpers';
import { ACTIONS, STEP_NOTE } from '../../../constants';
import { trackAction } from '../../../actions/analytics';
import { updateChallengeNote } from '../../../actions/steps';
import { navigatePush, navigateBack } from '../../../actions/navigation';
import CelebrationScreen, {
  CELEBRATION_SCREEN,
} from '../../../containers/CelebrationScreen';
import StageScreen, { STAGE_SCREEN } from '../../../containers/StageScreen';
import { reloadJourney } from '../../../actions/journey';

export const StageStepFlowScreens = {
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

export const StageStepFlowNavigator = createStackNavigator(
  StageStepFlowScreens,
  {
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
);
