// eslint-disable-next-line import/named
import { StackActions } from 'react-navigation';

import { wrapNextAction } from '../helpers';
import { reloadJourney } from '../../actions/journey';
import CelebrationScreen, {
  CELEBRATION_SCREEN,
} from '../../containers/CelebrationScreen';

export const GifCompleteFlowScreens = {
  [CELEBRATION_SCREEN]: wrapNextAction(
    CelebrationScreen,
    ({ personId }) => dispatch => {
      dispatch(reloadJourney(personId));
      dispatch(StackActions.popToTop());

      dispatch(StackActions.pop({ immediate: true }));
    },
  ),
};
