import callApi, { REQUESTS } from './api';
import { REMOVE_STEP_REMINDER, ADD_STEP_REMINDER } from '../constants';
import { formatApiDate } from '../utils/common';


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
    return dispatch(callApi(REQUESTS.CHALLENGE_COMPLETE, query, data));
  };
}

export function deleteStep(id) {
  return (dispatch) => {
    const query = { challenge_id: id };
    return dispatch(callApi(REQUESTS.DELETE_CHALLENGE, query, {})).then((r)=>{
      dispatch(getMySteps());
      return r;
    });
  };
}
