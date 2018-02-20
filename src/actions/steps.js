import i18next from 'i18next';

import callApi, { REQUESTS } from './api';
import { REMOVE_STEP_REMINDER, ADD_STEP_REMINDER, COMPLETED_STEP_COUNT, STEP_NOTE } from '../constants';
import { buildTrackingObj, formatApiDate, getAnalyticsSubsection } from '../utils/common';
import { navigatePush, navigateBack } from './navigation';
import { ADD_STEP_SCREEN } from '../containers/AddStepScreen';
import { CELEBRATION_SCREEN } from '../containers/CelebrationScreen';
import { STAGE_SCREEN } from '../containers/StageScreen';
import { PERSON_STAGE_SCREEN } from '../containers/PersonStageScreen';
import { getPerson } from './people';
import { trackState } from './analytics';

export function getStepSuggestions() {
  return (dispatch) => {
    const query = {};
    // const query = { filters: { locale: 'en' } };
    return dispatch(callApi(REQUESTS.GET_CHALLENGE_SUGGESTIONS, query));
  };
}

export function getMySteps() {
  return (dispatch) => {
    const query = {
      filters: { completed: false },
    };
    return dispatch(callApi(REQUESTS.GET_MY_CHALLENGES, query));
  };
}

export function getStepsByFilter(filters = {}) {
  return (dispatch) => {
    const query = {
      filters,
    };
    return dispatch(callApi(REQUESTS.GET_CHALLENGES_BY_FILTER, query));
  };
}

export function addSteps(steps, receiverId) {
  return (dispatch) => {
    const query = {
      person_id: receiverId,
    };
    let newSteps = steps.map((s) => ({
      type: 'accepted_challenge',
      attributes: {
        title: s.body,
      },
    }));

    const data = {
      included: newSteps,
      include: 'received_challenges',
    };
    return dispatch(callApi(REQUESTS.ADD_CHALLENGES, query, data)).then((r)=>{
      dispatch(getMySteps());
      return r;
    });
  };
}

export function setStepReminder(step) {
  return (dispatch) => {
    return dispatch({
      type: ADD_STEP_REMINDER,
      step,
    });
  };
}

export function removeStepReminder(step) {
  return (dispatch) => {
    return dispatch({
      type: REMOVE_STEP_REMINDER,
      step,
    });
  };
}

export function completeStepReminder(step) {
  return (dispatch) => {
    return dispatch(challengeCompleteAction(step)).then((r) => {
      dispatch(getMySteps());
      dispatch(removeStepReminder(step));
      return r;
    });
  };
}

export function completeStep(step) {
  return (dispatch) => {
    return dispatch(challengeCompleteAction(step)).then((r)=>{
      dispatch(getMySteps());
      return r;
    });
  };
}

function challengeCompleteAction(step) {
  return (dispatch, getState) => {
    const query = { challenge_id: step.id };
    const data = {
      data: {
        type: 'accepted_challenge',
        attributes: {
          completed_at: formatApiDate(),
        },
      },
    };
    const myId = getState().auth.personId;

    return dispatch(callApi(REQUESTS.CHALLENGE_COMPLETE, query, data)).then((results) => {
      dispatch({ type: COMPLETED_STEP_COUNT, userId: step.receiver.id });
      dispatch(navigatePush(ADD_STEP_SCREEN, {
        type: STEP_NOTE,
        onComplete: (text) => {
          if (text) {
            const noteData = {
              data: {
                type: 'accepted_challenge',
                attributes: {
                  note: text,
                },
              },
            };
            dispatch(callApi(REQUESTS.CHALLENGE_COMPLETE, query, noteData));
          }

          const count = getState().steps.userStepCount[step.receiver.id];
          const isMe = myId === `${step.receiver.id}`;

          const nextStageScreen = isMe ? STAGE_SCREEN : PERSON_STAGE_SCREEN;
          const subsection = isMe ? 'self' : 'person';
          const trackingObj = buildTrackingObj(`people : ${subsection} : steps : gif`, 'people', subsection, 'steps');

          if (count % 3 === 0) {
            dispatch(getPerson(step.receiver.id)).then((results2) => {
              const assignment = results2.findAll('contact_assignment')
                .find((a) => a && a.assigned_to ? `${a.assigned_to.id}` === myId : false);

              const stages = getState().stages.stages;
              const pathwayStageId = assignment && assignment.pathway_stage_id;
              let firstItemIndex = stages.findIndex((s) => `${s.id}` === `${pathwayStageId}`);
              firstItemIndex = firstItemIndex >= 0 ? firstItemIndex : undefined;

              let stageProps = {
                section: 'people',
                subsection: subsection,
                onComplete: () => {
                  dispatch(navigatePush(CELEBRATION_SCREEN, {
                    onComplete: () => {
                      dispatch(navigateBack(3));
                    },
                  }));

                  dispatch(trackState(trackingObj));
                },
                contactId: isMe ? myId : step.receiver.id,
                firstItem: firstItemIndex,
                enableBackButton: false,
                noNav: true,
                questionText: isMe ? i18next.t('selectStage:completed3StepsMe') : i18next.t('selectStage:completed3Steps', { name: step.receiver.first_name }),
              };
              if (!isMe) {
                stageProps.contactAssignmentId = assignment && assignment.id;
                stageProps.name = step.receiver.first_name;
              }

              dispatch(navigatePush(nextStageScreen, stageProps));
            });
          } else {
            dispatch(navigatePush(CELEBRATION_SCREEN, {
              onComplete: () => {
                dispatch(navigateBack(2));
              },
            }));

            dispatch(trackState(trackingObj));
          }
        },
      }));

      const subsection = getAnalyticsSubsection( step.receiver.id, myId );
      const trackingObj = buildTrackingObj(`people : ${subsection} : steps : complete comment`, 'people', subsection, 'steps');
      dispatch(trackState(trackingObj));

      return results;
    });
  };
}

export function deleteStep(step) {
  return (dispatch) => {
    const query = { challenge_id: step.id };
    return dispatch(callApi(REQUESTS.DELETE_CHALLENGE, query, {})).then((r)=>{
      dispatch(removeStepReminder(step));
      dispatch(getMySteps());
      return r;
    });
  };
}
