import {FIRST_NAME_CHANGED, LAST_NAME_CHANGED, NAME} from '../constants';
import {REQUESTS} from './api';
import callApi from './api';
import uuidv4 from 'uuid/v4';

export function setFirstAndLastName(firstName, lastName) {
  return {
    type: NAME,
    firstName: firstName,
    lastName: lastName,
  };
}

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
    return dispatch(callApi(REQUESTS.CREATE_MY_PERSON, {}, data)).catch((error) => {
      LOG('error creating person', error);
    });
  };
}