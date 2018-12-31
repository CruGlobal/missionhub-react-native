import { createStackNavigator } from 'react-navigation';
import i18next from 'i18next';

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
import { trackAction, trackStepsAdded } from '../../actions/analytics';
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
      ({ text, stepId, person, orgId }) => async (dispatch, getState) => {
        if (text) {
          await dispatch(updateChallengeNote(stepId, text));
          dispatch(
            trackAction(ACTIONS.INTERACTION.name, {
              [ACTIONS.INTERACTION.COMMENT]: null,
            }),
          );
        }

        const {
          stages: { stages, stagesObj },
          auth: { person: authPerson },
          steps,
        } = getState();
        const personId = person.id;

        const hasHitCount = hasHitThreeSteps(steps.userStepCount[personId]);
        const isMe = authPerson.id === personId;
        const assignment = await getReverseAssignment(
          dispatch,
          isMe,
          personId,
          orgId,
          authPerson,
        );
        const stageId = getStageId(isMe, assignment, authPerson);
        const isNotSure = hasNotSureStage(stagesObj, stageId);

        // If person hasn't hit the count and they're NOT on the "not sure" stage
        // Send them through to celebrate and complete
        if (!hasHitCount && !isNotSure) {
          dispatch(navigatePush(CELEBRATION_SCREEN));
        }

        const firstItemIndex = getStageIndex(stages, stageId);
        const nextStageScreen = isMe ? STAGE_SCREEN : PERSON_STAGE_SCREEN;
        const subsection = isMe ? 'self' : 'person';

        let questionText;
        if (isMe && hasHitCount) {
          questionText = i18next.t('selectStage:completed3StepsMe');
        } else if (!isMe && isNotSure) {
          // Reset the user's step count so we don't show the wrong message once they hit 3 completed steps
          dispatch({ type: RESET_STEP_COUNT, userId: personId });
          questionText = i18next.t('selectStage:completed1Step', {
            name: person.first_name,
          });
        } else if (!isMe && hasHitCount) {
          questionText = i18next.t('selectStage:completed3Steps', {
            name: person.first_name,
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
              ? { contactId: authPerson.id }
              : {
                  contactId: personId,
                  contactAssignmentId: assignment.id,
                  name: person.first_name,
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

async function getReverseAssignment(
  dispatch,
  isMe,
  personId,
  orgId,
  authPerson,
) {
  if (!isMe) {
    const personDetailResults = await dispatch(
      getPersonDetails(personId, orgId),
    );

    return (
      getReverseContactAssigment(personDetailResults.person, authPerson.id) ||
      {}
    );
  }
  return null;
}

function getStageId(isMe, assignment, authPerson) {
  return isMe
    ? authPerson.user.pathway_stage_id
    : assignment.pathway_stage_id || null;
}

function hasNotSureStage(stagesObj, stageId) {
  return (stagesObj[stageId] || {}).name_i18n === 'notsure_name';
}
