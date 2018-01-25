import { FIRST_NAME_CHANGED, LAST_NAME_CHANGED, SET_VISIBLE_PERSON_INFO, UPDATE_VISIBLE_PERSON_INFO } from '../constants';
import { REQUESTS } from './api';
import callApi from './api';
import uuidv4 from 'uuid/v4';

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

export function setVisiblePersonInfo(info) {
  return {
    type: SET_VISIBLE_PERSON_INFO,
    data: info,
  };
}

export function updateVisiblePersonInfo(info) {
  return {
    type: UPDATE_VISIBLE_PERSON_INFO,
    data: info,
  };
}

export function deleteContactAssignment(id) {
  return (dispatch) => {
    return dispatch(callApi(REQUESTS.DELETE_CONTACT_ASSIGNMENT, { contactAssignmentId: id })).catch((error) => {
      LOG('error deleting contact assignment', error);
    });
  };
}

