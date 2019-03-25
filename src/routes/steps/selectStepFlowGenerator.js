import { StackActions } from 'react-navigation';

import { wrapNextAction, wrapNextScreen } from '../helpers';
import { reloadJourney } from '../../actions/journey';
import SuggestedStepDetailScreen, {
  SUGGESTED_STEP_DETAIL_SCREEN,
} from '../../containers/SuggestedStepDetailScreen/index';
import AddStepScreen, {
  ADD_STEP_SCREEN,
} from '../../containers/AddStepScreen/index';
import CelebrationScreen, {
  CELEBRATION_SCREEN,
} from '../../containers/CelebrationScreen/index';
import { navigatePush } from '../../actions/navigation';
import { addStep } from '../../actions/steps';
import { buildCustomStep } from '../../utils/steps';
import { CREATE_STEP } from '../../constants';

export const selectStepFlowGenerator = (route, screen) => ({
  [route]: wrapNextAction(
    screen,
    ({ isAddingCustomStep, receiverId, orgId, step }) => dispatch =>
      isAddingCustomStep
        ? dispatch(
            navigatePush(ADD_STEP_SCREEN, {
              personId: receiverId,
              orgId,
              type: CREATE_STEP,
            }),
          )
        : dispatch(
            navigatePush(SUGGESTED_STEP_DETAIL_SCREEN, {
              step,
              receiverId,
              orgId,
            }),
          ),
  ),
  [SUGGESTED_STEP_DETAIL_SCREEN]: wrapNextScreen(
    SuggestedStepDetailScreen,
    CELEBRATION_SCREEN,
  ),
  [ADD_STEP_SCREEN]: wrapNextAction(
    AddStepScreen,
    ({ text, personId, orgId }) => (dispatch, getState) => {
      dispatch(
        addStep(
          buildCustomStep(text, getState().auth.person.id === personId),
          personId,
          { id: orgId },
        ),
      );
      dispatch(
        navigatePush(CELEBRATION_SCREEN, { contactId: personId, orgId }),
      );
    },
  ),
  [CELEBRATION_SCREEN]: wrapNextAction(
    CelebrationScreen,
    ({ contactId, orgId }) => dispatch => {
      dispatch(reloadJourney(contactId, orgId));
      dispatch(StackActions.popToTop());

      dispatch(StackActions.pop({ immediate: true }));
    },
  ),
});
