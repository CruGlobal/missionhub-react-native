import { StackActions } from 'react-navigation';

import { wrapNextAction, wrapNextScreen } from '../helpers';
import { reloadJourney } from '../../actions/journey';
import SuggestedStepDetailScreen, {
  SUGGESTED_STEP_DETAIL_SCREEN,
} from '../../containers/SuggestedStepDetailScreen';
import AddStepScreen, { ADD_STEP_SCREEN } from '../../containers/AddStepScreen';
import CelebrationScreen, {
  CELEBRATION_SCREEN,
} from '../../containers/CelebrationScreen';

export const GifCompleteFlowScreens = {
  [SUGGESTED_STEP_DETAIL_SCREEN]: wrapNextScreen(
    SuggestedStepDetailScreen,
    CELEBRATION_SCREEN,
  ),
  [ADD_STEP_SCREEN]: wrapNextScreen(AddStepScreen, CELEBRATION_SCREEN),
  [CELEBRATION_SCREEN]: wrapNextAction(
    CelebrationScreen,
    ({ contactId, orgId }) => dispatch => {
      dispatch(reloadJourney(contactId, orgId));
      dispatch(StackActions.popToTop());

      dispatch(StackActions.pop({ immediate: true }));
    },
  ),
};
