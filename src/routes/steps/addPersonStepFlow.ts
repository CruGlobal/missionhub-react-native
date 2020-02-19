import { createStackNavigator } from 'react-navigation-stack';

import { CREATE_STEP } from '../../constants';
import { createCustomStep } from '../../actions/steps';
import { navigatePush } from '../../actions/navigation';
import { setAnalyticsSelfOrContact } from '../../actions/analytics';
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
    ({ personId, step, orgId }) =>
      step
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
    () => dispatch => {
      dispatch(setAnalyticsSelfOrContact(''));
      dispatch(navigatePush(CELEBRATION_SCREEN));
    },
  ),
  [ADD_STEP_SCREEN]: wrapNextAction(
    AddStepScreen,
    ({ text, personId, orgId }) => dispatch => {
      dispatch(setAnalyticsSelfOrContact(''));
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
