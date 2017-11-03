import { NAME } from '../constants';

export function setFirstAndLastName(firstName, lastName) {
  return {
    type: NAME,
    firstName: firstName,
    lastName: lastName,
  };
}