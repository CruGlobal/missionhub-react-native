import callApi, { REQUESTS } from './api';
import { REMOVE_STEP_REMINDER, ADD_STEP_REMINDER } from '../constants';
import { formatApiDate } from '../utils/common';
import { navigatePush } from './navigation';
import { ADD_STEP_SCREEN } from '../containers/AddStepScreen';
import { CELEBRATION_SCREEN } from '../containers/CelebrationScreen';


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

export function challengeCompleteAction(step) {
  return (dispatch) => {
    const query = { challenge_id: step.id };
    const data = {
      data: {
        type: 'accepted_challenge',
        attributes: {
          completed_at: formatApiDate(),
        },
      },
    };
    return dispatch(callApi(REQUESTS.CHALLENGE_COMPLETE, query, data)).then((results)=> {
      dispatch(navigatePush(ADD_STEP_SCREEN, {
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
          dispatch(navigatePush(CELEBRATION_SCREEN));
        },
        type: 'stepNote',
      }));
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
