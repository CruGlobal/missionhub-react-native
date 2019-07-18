import { createStackNavigator } from 'react-navigation';

import { wrapNextAction } from '../helpers';
import { navigateBack } from '../../actions/navigation';
import { getJourney } from '../../actions/journey';
import { EDIT_JOURNEY_STEP } from '../../constants';
import AddStepScreen, { ADD_STEP_SCREEN } from '../../containers/AddStepScreen';
import { updateChallengeNote } from '../../actions/steps';
import { editComment } from '../../actions/interactions';

export const JourneyEditFlowScreens = {
  [ADD_STEP_SCREEN]: wrapNextAction(
    AddStepScreen,
    ({ text, id, type, personId, orgId }) => async dispatch => {
      await dispatch(
        type === EDIT_JOURNEY_STEP
          ? updateChallengeNote(id, text)
          : editComment(id, text),
      );

      dispatch(getJourney(personId, orgId));

      dispatch(navigateBack());
    },
  ),
};

export const JourneyEditFlowNavigator = createStackNavigator(
  JourneyEditFlowScreens,
  {
    defaultNavigationOptions: {
      header: null,
    },
  },
);
