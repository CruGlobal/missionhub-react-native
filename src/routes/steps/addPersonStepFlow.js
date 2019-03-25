import { createStackNavigator } from 'react-navigation';

import { CREATE_STEP } from '../../constants';
import { wrapNextAction } from '../helpers';
import PersonSelectStepScreen, {
  PERSON_SELECT_STEP_SCREEN,
} from '../../containers/PersonSelectStepScreen';
import { GifCompleteFlowScreens } from '../flowCompleted/gifCompleteFlow';
import { navigatePush } from '../../actions/navigation';
import { SUGGESTED_STEP_DETAIL_SCREEN } from '../../containers/SuggestedStepDetailScreen';
import { ADD_STEP_SCREEN } from '../../containers/AddStepScreen';

export const AddPersonStepFlowScreens = {
  [PERSON_SELECT_STEP_SCREEN]: wrapNextAction(
    PersonSelectStepScreen,
    ({ isAddingCustomStep, receiverId, orgId, step }) => dispatch => {
      if (isAddingCustomStep) {
        return dispatch(
          navigatePush(ADD_STEP_SCREEN, {
            personId: receiverId,
            orgId,
            type: CREATE_STEP,
          }),
        );
      }

      return dispatch(
        navigatePush(SUGGESTED_STEP_DETAIL_SCREEN, {
          step,
          receiverId,
          orgId,
        }),
      );
    },
  ),
  ...GifCompleteFlowScreens,
};

export const AddPersonStepFlowNavigator = createStackNavigator(
  AddPersonStepFlowScreens,
  {
    navigationOptions: {
      header: null,
    },
  },
);
