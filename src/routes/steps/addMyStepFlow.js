import { createStackNavigator } from 'react-navigation-stack';

import { CREATE_STEP } from '../../constants';
import { createCustomStep } from '../../actions/steps';
import { navigatePush } from '../../actions/navigation';
import { wrapNextScreen, wrapNextAction } from '../helpers';
import { buildTrackingObj } from '../../utils/common';
import SelectMyStepScreen, {
  SELECT_MY_STEP_SCREEN,
} from '../../containers/SelectMyStepScreen';
import SuggestedStepDetailScreen, {
  SUGGESTED_STEP_DETAIL_SCREEN,
} from '../../containers/SuggestedStepDetailScreen';
import AddStepScreen, { ADD_STEP_SCREEN } from '../../containers/AddStepScreen';
import { CELEBRATION_SCREEN } from '../../containers/CelebrationScreen';
import { GifCompleteFlowScreens } from '../flowCompleted/gifCompleteFlow';

export const AddMyStepFlowScreens = {
  [SELECT_MY_STEP_SCREEN]: wrapNextAction(
    SelectMyStepScreen,
    ({ personId, step, orgId }) =>
      step
        ? navigatePush(SUGGESTED_STEP_DETAIL_SCREEN, {
            step,
            receiverId: personId,
            orgId,
          })
        : navigatePush(ADD_STEP_SCREEN, {
            type: CREATE_STEP,
            personId,
            orgId,
            trackingObj: buildTrackingObj(
              'people : self : steps : create',
              'people',
              'self',
              'steps',
            ),
          }),
  ),
  [SUGGESTED_STEP_DETAIL_SCREEN]: wrapNextScreen(
    SuggestedStepDetailScreen,
    CELEBRATION_SCREEN,
  ),
  [ADD_STEP_SCREEN]: wrapNextAction(
    AddStepScreen,
    ({ text, personId, orgId }) => dispatch => {
      dispatch(createCustomStep(text, personId, orgId));
      dispatch(navigatePush(CELEBRATION_SCREEN));
    },
  ),
  ...GifCompleteFlowScreens,
};

export const AddMyStepFlowNavigator = createStackNavigator(
  AddMyStepFlowScreens,
  {
    defaultNavigationOptions: {
      header: null,
    },
  },
);
