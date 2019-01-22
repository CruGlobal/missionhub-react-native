import { createStackNavigator } from 'react-navigation';
import i18next from 'i18next';

import { buildTrackedScreen, wrapNextAction } from '../helpers';
import { buildTrackingObj, getStageIndex } from '../../utils/common';
import { navigatePush, navigateBack } from '../../actions/navigation';
import { firstTime, loadHome } from '../../actions/auth';
import { reloadJourney } from '../../actions/journey';
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
import SelectMyStepScreen, {
  SELECT_MY_STEP_SCREEN,
} from '../../containers/SelectMyStepScreen';
import PersonSelectStepScreen, {
  PERSON_SELECT_STEP_SCREEN,
} from '../../containers/PersonSelectStepScreen';
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

        const {
          stages: { stages, stagesObj },
          auth: { person: authPerson },
          steps,
        } = getState();

        const isMe = personId === authPerson.id;
        const person = isMe
          ? authPerson
          : (await dispatch(getPersonDetails(personId, orgId))).person;
        const assignment = await getReverseContactAssignment(
          isMe,
          person,
          orgId,
          authPerson,
        );
        const stageId = getStageId(isMe, assignment, authPerson);

        const hasHitCount = hasHitThreeSteps(steps, personId);
        const isNotSure = hasNotSureStage(stagesObj, stageId);

        // If person hasn't hit the count and they're NOT on the "not sure" stage
        // Send them through to celebrate and complete
        if (!hasHitCount && !isNotSure) {
          return dispatch(navigatePush(CELEBRATION_SCREEN));
        }

        const firstItemIndex = getStageIndex(stages, stageId);
        const nextStageScreen = isMe ? STAGE_SCREEN : PERSON_STAGE_SCREEN;
        const subsection = isMe ? 'self' : 'person';
        const name = isMe ? authPerson.first_name : person.first_name;
        const questionText = isMe
          ? isNotSure
            ? i18next.t('selectStage:meQuestion', {
                name,
              })
            : i18next.t('selectStage:completed3StepsMe')
          : isNotSure
            ? i18next.t('selectStage:completed1Step', {
                name,
              })
            : i18next.t('selectStage:completed3Steps', {
                name,
              });

        if (isNotSure) {
          // Reset the user's step count so we don't show the wrong message once they hit 3 completed steps
          dispatch({
            type: RESET_STEP_COUNT,
            userId: personId,
          });
        }

        dispatch(
          navigatePush(nextStageScreen, {
            section: 'people',
            subsection: subsection,
            firstItem: firstItemIndex,
            enableBackButton: false,
            noNav: true,
            questionText,
            orgId,
            ...(isMe
              ? { contactId: authPerson.id }
              : {
                  contactId: personId,
                  contactAssignmentId: assignment.id,
                  name,
                }),
          }),
        );
      },
    ),
  ),
  [STAGE_SCREEN]: buildTrackedScreen(
    wrapNextAction(StageScreen, ({ stage, orgId }) => dispatch => {
      return dispatch(
        navigatePush(SELECT_MY_STEP_SCREEN, {
          enableBackButton: true,
          contactStage: stage,
          organization: { id: orgId },
        }),
      );
    }),
  ),
  [PERSON_STAGE_SCREEN]: buildTrackedScreen(
    wrapNextAction(
      PersonStageScreen,
      ({ stage, contactId, name, orgId }) => dispatch => {
        dispatch(
          navigatePush(PERSON_SELECT_STEP_SCREEN, {
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
            trackingObj: buildTrackingObj(
              'people : person : steps : add',
              'people',
              'person',
              'steps',
            ),
          }),
        );
      },
    ),
  ),
  [SELECT_MY_STEP_SCREEN]: buildTrackedScreen(
    wrapNextAction(SelectMyStepScreen, ({ personId, orgId }) => dispatch => {
      dispatch(reloadJourney(personId, orgId));
      return dispatch(navigatePush(CELEBRATION_SCREEN));
    }),
  ),
  [PERSON_SELECT_STEP_SCREEN]: buildTrackedScreen(
    wrapNextAction(
      PersonSelectStepScreen,
      ({ contactId, orgId }) => dispatch => {
        dispatch(reloadJourney(contactId, orgId));
        return dispatch(navigatePush(CELEBRATION_SCREEN));
      },
    ),
  ),
  [CELEBRATION_SCREEN]: buildTrackedScreen(
    wrapNextAction(CelebrationScreen, () => dispatch => {}),
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

async function getReverseContactAssignment(isMe, person, orgId, authPerson) {
  return isMe
    ? null
    : ((person && person.reverse_contact_assignments) || []).find(
        a =>
          a &&
          ((a.organization && a.organization.id === orgId) ||
            (!a.organization && (!orgId || orgId === 'personal'))) &&
          a.assigned_to &&
          a.assigned_to.id === authPerson.id,
      ) || null;
}

function getStageId(isMe, assignment, authPerson) {
  return isMe
    ? authPerson.user.pathway_stage_id
    : (assignment && assignment.pathway_stage_id) || null;
}

function hasHitThreeSteps(steps, personId) {
  return steps.userStepCount[personId] % 3 === 0;
}

function hasNotSureStage(stagesObj, stageId) {
  return (stagesObj[stageId] || {}).name_i18n === 'notsure_name';
}
