import {FIRST_NAME_CHANGED, LAST_NAME_CHANGED, NAME} from '../constants';

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