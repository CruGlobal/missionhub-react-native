import { createStackNavigator, StackActions } from 'react-navigation';

import { wrapNextAction, wrapNextScreen } from '../helpers';
import { buildTrackingObj } from '../../utils/common';
import { navigatePush } from '../../actions/navigation';
import { reloadJourney } from '../../actions/journey';
import { RESET_STEP_COUNT } from '../../constants';
import AddStepScreen, { ADD_STEP_SCREEN } from '../../containers/AddStepScreen';
import StageScreen, { STAGE_SCREEN } from '../../containers/StageScreen';
import PersonStageScreen, {
  PERSON_STAGE_SCREEN,
} from '../../containers/PersonStageScreen';
import SelectMyStepScreen, {
  SELECT_MY_STEP_SCREEN,
} from '../../containers/SelectMyStepScreen';
import PersonSelectStepScreen, {
  PERSON_SELECT_STEP_SCREEN,
} from '../../containers/PersonSelectStepScreen';
import CelebrationScreen, {
  CELEBRATION_SCREEN,
} from '../../containers/CelebrationScreen';

import { paramsforStageNavigation } from './utils';

export const CompleteStepFlowScreens = {
  [ADD_STEP_SCREEN]: wrapNextAction(
    AddStepScreen,
    ({ personId, orgId }) => (dispatch, getState) => {
      const {
        isMe,
        hasHitCount,
        isNotSure,
        subsection,
        firstItemIndex,
        questionText,
        assignment,
        name,
      } = paramsforStageNavigation(personId, orgId, getState);

      // If person hasn't hit the count and they're NOT on the "not sure" stage
      // Send them through to celebrate and complete
      if (!hasHitCount && !isNotSure) {
        return dispatch(
          navigatePush(CELEBRATION_SCREEN, { contactId: personId, orgId }),
        );
      }

      if (isNotSure) {
        // Reset the user's step count so we don't show the wrong message once they hit 3 completed steps
        dispatch({ type: RESET_STEP_COUNT, userId: personId });
      }

      dispatch(
        navigatePush(isMe ? STAGE_SCREEN : PERSON_STAGE_SCREEN, {
          section: 'people',
          subsection,
          firstItem: firstItemIndex,
          enableBackButton: false,
          noNav: true,
          questionText,
          orgId,
          contactId: personId,
          contactAssignmentId: assignment && assignment.id,
          name,
        }),
      );
    },
  ),
  [STAGE_SCREEN]: wrapNextAction(
    StageScreen,
    ({ stage, contactId, orgId, isAlreadySelected }) => dispatch => {
      dispatch(
        isAlreadySelected
          ? navigatePush(CELEBRATION_SCREEN, { contactId, orgId })
          : navigatePush(SELECT_MY_STEP_SCREEN, {
              enableBackButton: true,
              contactId,
              contactStage: stage,
              organization: { id: orgId },
            }),
      );
    },
  ),
  [PERSON_STAGE_SCREEN]: wrapNextAction(
    PersonStageScreen,
    ({ stage, contactId, name, orgId, isAlreadySelected }) => dispatch => {
      dispatch(
        isAlreadySelected
          ? navigatePush(CELEBRATION_SCREEN, { contactId, orgId })
          : navigatePush(PERSON_SELECT_STEP_SCREEN, {
              contactStage: stage,
              contactId,
              organization: { id: orgId },
              contactName: name,
              createStepTracking: buildTrackingObj(
                'people : person : steps : create',
                'people',
                'person',
                'steps',
              ),
            }),
      );
    },
  ),
  [SELECT_MY_STEP_SCREEN]: wrapNextScreen(
    SelectMyStepScreen,
    CELEBRATION_SCREEN,
  ),
  [PERSON_SELECT_STEP_SCREEN]: wrapNextScreen(
    PersonSelectStepScreen,
    CELEBRATION_SCREEN,
  ),
  [CELEBRATION_SCREEN]: wrapNextAction(
    CelebrationScreen,
    ({ contactId, orgId }) => dispatch => {
      dispatch(reloadJourney(contactId, orgId));
      dispatch(StackActions.popToTop());

      const popAction = StackActions.pop({ immediate: true });
      dispatch(popAction);
      dispatch(popAction);
    },
  ),
};
export const CompleteStepFlowNavigator = createStackNavigator(
  CompleteStepFlowScreens,
  {
    navigationOptions: {
      header: null,
    },
  },
);
