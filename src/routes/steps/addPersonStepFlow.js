import { createStackNavigator } from 'react-navigation';

import { CREATE_STEP } from '../../constants';
import { createCustomStep, addStep } from '../../actions/steps';
import { navigatePush } from '../../actions/navigation';
import { buildTrackingObj } from '../../utils/common';
import { wrapNextAction } from '../helpers';
import PersonSelectStepScreen, {
  PERSON_SELECT_STEP_SCREEN,
} from '../../containers/PersonSelectStepScreen';
import SuggestedStepDetailScreen, {
  SUGGESTED_STEP_DETAIL_SCREEN,
} from '../../containers/SuggestedStepDetailScreen';
import AddStepScreen, { ADD_STEP_SCREEN } from '../../containers/AddStepScreen';
import { CELEBRATION_SCREEN } from '../../containers/CelebrationScreen';
import { GifCompleteFlowScreens } from '../flowCompleted/gifCompleteFlow';

export const AddPersonStepFlowScreens = {
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
    ({ step, contactId, orgId }) => dispatch => {
      dispatch(addStep(step, contactId, orgId));
      dispatch(navigatePush(CELEBRATION_SCREEN));
    },
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

export const AddPersonStepFlowNavigator = createStackNavigator(
  AddPersonStepFlowScreens,
  {
    defaultNavigationOptions: {
      header: null,
    },
  },
);
