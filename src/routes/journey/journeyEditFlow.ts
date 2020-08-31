import { createStackNavigator } from 'react-navigation-stack';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { wrapNextAction } from '../helpers';
import { navigateBack } from '../../actions/navigation';
import { getJourney } from '../../actions/journey';
import { EDIT_JOURNEY_STEP } from '../../constants';
import AddStepScreen, {
  ADD_STEP_SCREEN,
  AddStepScreenNextProps,
} from '../../containers/AddStepScreen';
import { updateChallengeNote } from '../../actions/steps';
import { editComment } from '../../actions/interactions';
import { RootState } from '../../reducers';

export const JourneyEditFlowScreens = {
  [ADD_STEP_SCREEN]: wrapNextAction(
    AddStepScreen,
    ({ text, id, type, personId }: AddStepScreenNextProps) => async (
      dispatch: ThunkDispatch<RootState, never, AnyAction>,
    ) => {
      dispatch(navigateBack());

      if (type === EDIT_JOURNEY_STEP) {
        id && text && (await dispatch(updateChallengeNote(id, text)));
      } else {
        await dispatch(editComment(id, text));
      }

      dispatch(getJourney(personId));
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
