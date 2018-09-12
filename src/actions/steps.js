import i18next from 'i18next';

import {
  TOGGLE_STEP_FOCUS,
  COMPLETED_STEP_COUNT,
  STEP_NOTE,
  ACTIONS,
  DEFAULT_PAGE_LIMIT,
} from '../constants';
import {
  buildTrackingObj,
  formatApiDate,
  getAnalyticsSubsection,
  isCustomStep,
  getStageIndex,
} from '../utils/common';
import { ADD_STEP_SCREEN } from '../containers/AddStepScreen';
import { CELEBRATION_SCREEN } from '../containers/CelebrationScreen';
import { STAGE_SCREEN } from '../containers/StageScreen';
import { PERSON_STAGE_SCREEN } from '../containers/PersonStageScreen';

import { refreshImpact } from './impact';
import { getPersonDetails } from './person';
import { navigatePush, navigateBack } from './navigation';
import callApi, { REQUESTS } from './api';
import { trackAction, trackStepsAdded } from './analytics';
import { reloadJourney } from './journey';
import { reloadGroupCelebrateFeed } from './celebration';

export function getStepSuggestions(isMe, contactStageId) {
  return dispatch => {
    const language = i18next.language;
    const query = {
      filters: {
        locale: language,
        self_step: isMe,
        pathway_stage_id: contactStageId,
      },
    };

    return dispatch(callApi(REQUESTS.GET_CHALLENGE_SUGGESTIONS, query));
  };
}

export function getMySteps(query = {}) {
  return dispatch => {
    const queryObj = {
      order: '-focused_at,-accepted_at',
      ...query,
      filters: {
        ...(query.filters || {}),
        completed: false,
      },
      include:
        'receiver.reverse_contact_assignments,receiver.organizational_permissions',
    };
    return dispatch(callApi(REQUESTS.GET_MY_CHALLENGES, queryObj));
  };
}

export function getMyStepsNextPage() {
  return (dispatch, getState) => {
    const { page, hasNextPage } = getState().steps.pagination;
    if (!hasNextPage) {
      // Does not have more data
      return Promise.resolve();
    }
    const query = {
      page: {
        limit: DEFAULT_PAGE_LIMIT,
        offset: DEFAULT_PAGE_LIMIT * page,
      },
      include: '',
    };
    return dispatch(getMySteps(query));
  };
}

export function getContactSteps(personId, orgId) {
  return dispatch => {
    const query = {
      filters: {
        completed: false,
        receiver_ids: personId,
        organization_ids: orgId || 'personal',
      },
      include: 'receiver',
      page: { limit: 1000 },
    };
    return dispatch(callApi(REQUESTS.GET_CHALLENGES_BY_FILTER, query));
  };
}

export function addSteps(steps, receiverId, organization) {
  return dispatch => {
    const query = {
      person_id: receiverId,
    };
    const newSteps = steps.map(s => ({
      type: 'accepted_challenge',
      attributes: {
        title: s.body,
        challenge_suggestion_id: s && isCustomStep(s) ? null : (s || {}).id,
        ...(organization && organization.id !== 'personal'
          ? { organization_id: organization.id }
          : {}),
      },
    }));

    const data = {
      included: newSteps,
      include: 'received_challenges',
    };
    return dispatch(callApi(REQUESTS.ADD_CHALLENGES, query, data)).then(r => {
      dispatch(getMySteps());
      dispatch(trackStepsAdded(steps));

      return r;
    });
  };
}

export function setStepFocus(step, isFocus) {
  return async dispatch => {
    const query = { challenge_id: step.id };
    const data = {
      data: {
        type: 'accepted_challenge',
        attributes: {
          organization_id: step.organization ? step.organization.id : null,
          focus: isFocus,
        },
        relationships: {
          receiver: {
            data: {
              type: 'person',
              id: step.receiver.id,
            },
          },
        },
      },
    };

    const { response } = await dispatch(
      callApi(REQUESTS.CHALLENGE_SET_FOCUS, query, data),
    );
    if (step.focus !== response.focus) {
      dispatch({ type: TOGGLE_STEP_FOCUS, step });
    }
  };
}

export function updateChallengeNote(step, note) {
  return dispatch => {
    const query = { challenge_id: step.id };
    const data = buildChallengeData({ note });

    return dispatch(callApi(REQUESTS.CHALLENGE_COMPLETE, query, data));
  };
}

export function completeStepReminder(step, screen) {
  return dispatch => {
    return dispatch(challengeCompleteAction(step, screen)).then(r => {
      dispatch(getMySteps());
      dispatch(setStepFocus(step, false));
      return r;
    });
  };
}

export function completeStep(step, screen) {
  return dispatch => {
    return dispatch(challengeCompleteAction(step, screen)).then(r => {
      dispatch(getMySteps());
      dispatch(reloadGroupCelebrateFeed(step.organization.id));
      return r;
    });
  };
}

function buildChallengeData(attributes) {
  return {
    data: {
      type: 'accepted_challenge',
      attributes,
    },
  };
}

function challengeCompleteAction(step, screen) {
  return (dispatch, getState) => {
    const query = { challenge_id: step.id };
    const data = buildChallengeData({ completed_at: formatApiDate() });
    const {
      person: { id: myId },
    } = getState().auth;

    return dispatch(callApi(REQUESTS.CHALLENGE_COMPLETE, query, data)).then(
      challengeCompleteResult => {
        const subsection = getAnalyticsSubsection(step.receiver.id, myId);

        dispatch({ type: COMPLETED_STEP_COUNT, userId: step.receiver.id });
        dispatch(refreshImpact());
        dispatch(
          navigatePush(ADD_STEP_SCREEN, {
            trackingObj: buildTrackingObj(
              `people : ${subsection} : steps : complete comment`,
              'people',
              subsection,
              'steps',
            ),
            type: STEP_NOTE,
            onComplete: text => {
              if (text) {
                dispatch(updateChallengeNote(step, text)).then(() =>
                  dispatch(
                    trackAction(ACTIONS.INTERACTION.name, {
                      [ACTIONS.INTERACTION.COMMENT]: null,
                    }),
                  ),
                );
              }

              const count = getState().steps.userStepCount[step.receiver.id];
              const isMe = myId === `${step.receiver.id}`;

              const nextStageScreen = isMe ? STAGE_SCREEN : PERSON_STAGE_SCREEN;
              const subsection = isMe ? 'self' : 'person';
              const celebrationTrackingObj = buildTrackingObj(
                `people : ${subsection} : steps : gif`,
                'people',
                subsection,
                'steps',
              );

              if (count % 3 === 0) {
                dispatch(
                  getPersonDetails(
                    step.receiver.id,
                    step.organization && step.organization.id,
                  ),
                ).then(personDetailResults => {
                  const assignment = (
                    personDetailResults.person.reverse_contact_assignments || []
                  ).find(
                    a =>
                      a && a.assigned_to
                        ? `${a.assigned_to.id}` === myId
                        : false,
                  );

                  const firstItemIndex = getStageIndex(
                    getState().stages.stages,
                    assignment && assignment.pathway_stage_id,
                  );

                  const stageProps = {
                    section: 'people',
                    subsection: subsection,
                    onComplete: () => {
                      dispatch(
                        navigatePush(CELEBRATION_SCREEN, {
                          onComplete: () => {
                            dispatch(navigateBack(3));
                          },
                          trackingObj: celebrationTrackingObj,
                        }),
                      );

                      dispatch(
                        reloadJourney(
                          step.receiver.id,
                          step.organization && step.organization.id,
                        ),
                      );
                    },
                    contactId: isMe ? myId : step.receiver.id,
                    firstItem: firstItemIndex,
                    enableBackButton: false,
                    noNav: true,
                    questionText: isMe
                      ? i18next.t('selectStage:completed3StepsMe')
                      : i18next.t('selectStage:completed3Steps', {
                          name: step.receiver.first_name,
                        }),
                  };
                  if (!isMe) {
                    stageProps.contactAssignmentId =
                      assignment && assignment.id;
                    stageProps.name = step.receiver.first_name;
                  }

                  dispatch(navigatePush(nextStageScreen, stageProps));
                });
              } else {
                dispatch(
                  navigatePush(CELEBRATION_SCREEN, {
                    onComplete: () => {
                      dispatch(navigateBack(2));
                    },
                    trackingObj: celebrationTrackingObj,
                  }),
                );
              }
            },
          }),
        );

        dispatch(
          trackAction(`${ACTIONS.STEP_COMPLETED.name} on ${screen} Screen`, {
            [ACTIONS.STEP_COMPLETED.key]: null,
          }),
        );

        return challengeCompleteResult;
      },
    );
  };
}

export function deleteStepWithTracking(step, screen) {
  return dispatch => {
    return dispatch(deleteStep(step)).then(r => {
      dispatch(
        trackAction(`${ACTIONS.STEP_REMOVED.name} on ${screen} Screen`, {
          [ACTIONS.STEP_REMOVED.key]: null,
        }),
      );
      return r;
    });
  };
}

function deleteStep(step) {
  return dispatch => {
    const query = { challenge_id: step.id };
    return dispatch(callApi(REQUESTS.DELETE_CHALLENGE, query, {})).then(r => {
      dispatch(getMySteps());
      return r;
    });
  };
}
