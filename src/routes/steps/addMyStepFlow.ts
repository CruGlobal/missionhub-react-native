import { createStackNavigator } from 'react-navigation-stack';

import { CREATE_STEP } from '../../constants';
import { navigatePush } from '../../actions/navigation';
import { wrapNextScreen, wrapNextAction } from '../helpers';
import SelectStepScreen, {
  SELECT_STEP_SCREEN,
  SelectStepScreenNextProps,
} from '../../containers/SelectStepScreen';
import SuggestedStepDetailScreen, {
  SUGGESTED_STEP_DETAIL_SCREEN,
} from '../../containers/SuggestedStepDetailScreen';
import AddStepScreen, { ADD_STEP_SCREEN } from '../../containers/AddStepScreen';
import { CELEBRATION_SCREEN } from '../../containers/CelebrationScreen';
import { GifCompleteFlowScreens } from '../flowCompleted/gifCompleteFlow';

export const AddMyStepFlowScreens = {
  [SELECT_STEP_SCREEN]: wrapNextAction(
    SelectStepScreen,
    ({
      personId,
      stepSuggestionId,
      stepType,
      orgId,
    }: SelectStepScreenNextProps) =>
      stepSuggestionId
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
  [SUGGESTED_STEP_DETAIL_SCREEN]: wrapNextScreen(
    SuggestedStepDetailScreen,
    CELEBRATION_SCREEN,
  ),
  [ADD_STEP_SCREEN]: wrapNextAction(AddStepScreen, () => dispatch => {
    dispatch(navigatePush(CELEBRATION_SCREEN));
  }),
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
