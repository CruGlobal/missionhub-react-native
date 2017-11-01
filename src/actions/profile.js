import { NAME } from '../constants';

export function setFirstAndLastName(firstName, lastName) {
  return {
    type: NAME,
    payload: {
      firstName: firstName,
      lastName: lastName,
    },
  };
}