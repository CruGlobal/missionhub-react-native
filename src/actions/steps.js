import callApi, { REQUESTS } from './api';
import { REMOVE_STEP_REMINDER, ADD_STEP_REMINDER } from '../constants';


export function getStepSuggestions() {
  return (dispatch) => {
    const query = {};
    // const query = { filters: { locale: 'en' } };
    return dispatch(callApi(REQUESTS.GET_CHALLENGE_SUGGESTIONS, query));
  };
}

export function getMySteps() {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.GET_MY_CHALLENGES));
  };
}

export function addSteps(steps) {
  return (dispatch) => {
    const query = {};
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
    // const query = { filters: { locale: 'en' } };
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
