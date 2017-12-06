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

export function addSteps(steps) {
  return (dispatch, getState) => {
    const query = {
      person_id: getState().auth.personId,
    };
    let newSteps = steps.map((s) => ({
      type: 'accepted_challenge',
      attributes: {
        title: s.body,
      },
    }));

    const data = {
      // data: {
      //   type: 'person',
      //   attributes: {
      //     first_name: 'Steve',
      //     last_name: 'Rogers',
      //     gender: 'm',
      //   },
      // },
      included: newSteps,
      include: 'received_challenges',
    };
    return dispatch(callApi(REQUESTS.ADD_CHALLENGES, query, data));
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
    const query = { challenge_id: step.id };
    const data = {
      data: {
        type: 'accepted_challenge',
        attributes: {
          completed_at: formatApiDate(),
        },
      },
    };
    return dispatch(callApi(REQUESTS.CHALLENGE_COMPLETE, query, data)).then((r) => {
      dispatch(getMySteps());
      dispatch(removeStepReminder(step));
      return r;
    });
  };
}
