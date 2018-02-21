import {
  FIRST_NAME_CHANGED, LAST_NAME_CHANGED, PERSON_FIRST_NAME_CHANGED, PERSON_LAST_NAME_CHANGED,
  RESET_ONBOARDING_PERSON, UPDATE_ONBOARDING_PERSON,
} from '../constants';
import callApi, { REQUESTS } from './api';
import uuidv4 from 'uuid/v4';
import { updatePerson } from './person';

export function firstNameChanged(firstName) {
  return {
    type: FIRST_NAME_CHANGED,
    firstName: firstName,
  };
}

export function lastNameChanged(lastName) {
  return {
    type: LAST_NAME_CHANGED,
    lastName: lastName,
  };
}

export function createMyPerson(firstName, lastName) {
  const data = {
    code: uuidv4(),
    first_name: firstName,
    last_name: lastName,
  };

  return (dispatch) => {
    return dispatch(callApi(REQUESTS.CREATE_MY_PERSON, {}, data));
  };
}

export function personFirstNameChanged(firstName) {
  return {
    type: PERSON_FIRST_NAME_CHANGED,
    personFirstName: firstName,
  };
}

export function personLastNameChanged(lastName) {
  return {
    type: PERSON_LAST_NAME_CHANGED,
    personLastName: lastName,
  };
}

export function createPerson(firstName, lastName) {
  const data = {
    data: {
      type: 'person',
      attributes: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  };

  return (dispatch) => {
    return dispatch(callApi(REQUESTS.ADD_NEW_PERSON, {}, data));
  };
}

export function updateOnboardingPerson(data) {
  return (dispatch) => {
    return dispatch(updatePerson(data)).then((r) => {
      dispatch({ type: UPDATE_ONBOARDING_PERSON, results: r });
      return r;
    });
  };
}

export function resetPerson() {
  return { type: RESET_ONBOARDING_PERSON };
}
