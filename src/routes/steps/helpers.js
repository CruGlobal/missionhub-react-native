import { CREATE_STEP } from '../../constants';
import { wrapNextAction } from '../helpers';
import { navigatePush } from '../../actions/navigation';
import { SUGGESTED_STEP_DETAIL_SCREEN } from '../../containers/SuggestedStepDetailScreen';
import { ADD_STEP_SCREEN } from '../../containers/AddStepScreen';

export const selectStepFlowGenerator = screen =>
  wrapNextAction(
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
  );
