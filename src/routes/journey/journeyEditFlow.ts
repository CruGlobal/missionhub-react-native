import { createStackNavigator } from 'react-navigation-stack';
import { ThunkDispatch } from 'redux-thunk';

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
    ({
      text,
      id,
      type,
      personId,
      orgId,
    }: {
      text: string;
      id: string;
      type: string;
      personId: string;
      orgId: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) => async (dispatch: ThunkDispatch<any, null, any>) => {
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
