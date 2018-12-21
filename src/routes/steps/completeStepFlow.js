import { createStackNavigator } from 'react-navigation';

import { buildTrackedScreen, wrapNextAction } from '../helpers';
import { buildTrackingObj, getStageIndex } from '../../utils/common';
import { navigatePush, navigateBack } from '../../actions/navigation';
import { firstTime, loadHome } from '../../actions/auth';
import {
  completeOnboarding,
  stashCommunityToJoin,
  joinStashedCommunity,
  showNotificationPrompt,
  landOnStashedCommunityScreen,
} from '../../actions/onboardingProfile';
import { updateChallengeNote } from '../../actions/steps';
import { getPersonDetails } from '../../actions/person';
import { STEP_NOTE, RESET_STEP_COUNT, ACTIONS } from '../../constants';
import AddStepScreen, { ADD_STEP_SCREEN } from '../../containers/AddStepScreen';
import StageScreen, { STAGE_SCREEN } from '../../containers/StageScreen';
import PersonStageScreen, {
  PERSON_STAGE_SCREEN,
} from '../../containers/PersonStageScreen';
import CelebrationScreen, {
  CELEBRATION_SCREEN,
} from '../../containers/CelebrationScreen';

export const CompleteStepFlowScreens = {
  [ADD_STEP_SCREEN]: buildTrackedScreen(
    wrapNextAction(
      AddStepScreen,
      ({ text, stepId, personId, orgId }) => async (dispatch, getState) => {
        if (text) {
          await dispatch(updateChallengeNote(stepId, text));
          dispatch(
            trackAction(ACTIONS.INTERACTION.name, {
              [ACTIONS.INTERACTION.COMMENT]: null,
            }),
          );
        }

        const { stages, stagesObj } = getState().stages;
        const stageId = getStageId();
        const isMe = myId === personId;
        const hasHitCount = hasHitThreeSteps(
          getState().steps.userStepCount[personId],
        );
        const hasNotSureStage = await hasNotSureStage(
          isMe,
          myId,
          personId,
          orgId,
          getState,
        );
        const firstItemIndex = getStageIndex(stages, stageId);
        const subsection = isMe ? 'self' : 'person';

        let questionText;
        let nextStageScreen;

        if (isMe && hasHitCount) {
          nextStageScreen = STAGE_SCREEN;
          questionText = i18next.t('selectStage:completed3StepsMe');
        } else if (!isMe && hasNotSureStage) {
          // Reset the user's step count so we don't show the wrong message once they hit 3 completed steps
          dispatch({ type: RESET_STEP_COUNT, userId: personId });

          nextStageScreen = PERSON_STAGE_SCREEN;
          questionText = i18next.t('selectStage:completed1Step', {
            name: receiver.first_name,
          });
        } else if (!isMe && hasHitCount) {
          nextStageScreen = PERSON_STAGE_SCREEN;
          questionText = i18next.t('selectStage:completed3Steps', {
            name: receiver.first_name,
          });
        } else {
          return;
        }

        dispatch(
          navigatePush(nextStageScreen, {
            section: 'people',
            subsection: subsection,
            firstItem: firstItemIndex,
            enableBackButton: false,
            noNav: true,
            questionText,
            ...(isMe
              ? { contactId: myId }
              : {
                  contactId: personId,
                  contactAssignmentId: assignment.id,
                  name: receiver.first_name,
                }),
          }),
        );
      },
      { type: STEP_NOTE },
    ),
    buildTrackingObj(),
  ),
  [STAGE_SCREEN]: buildTrackedScreen(
    wrapNextAction(StageScreen, ({ signin }) => dispatch => {}),
    buildTrackingObj(),
  ),
  [PERSON_STAGE_SCREEN]: buildTrackedScreen(
    wrapNextAction(PersonStageScreen, () => async dispatch => {}),
    buildTrackingObj(),
  ),
  [CELEBRATION_SCREEN]: buildTrackedScreen(
    wrapNextAction(CelebrationScreen, () => async dispatch => {}),
    buildTrackingObj(),
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

function getReverseContactAssigment(person, myId) {
  return (person.reverse_contact_assignments || []).find(
    a => a && a.assigned_to && `${a.assigned_to.id}` === myId,
  );
}

function hasHitThreeSteps(stepsCount) {
  return stepsCount % 3 === 0;
}

async function getStageId(isMe, myId, personId, orgId, getState) {
  if (!isMe) {
    const personDetailResults = await dispatch(
      getPersonDetails(personId, orgId),
    );

    const assignment =
      getReverseContactAssigment(personDetailResults.person, myId) || {};
    return assignment.pathway_stage_id;
  } else {
    return getState().auth.person.user.pathway_stage_id;
  }
}

async function hasNotSureStage(stageId) {
  return (stagesObj[stageId] || {}).name_i18n === 'notsure_name';
}
