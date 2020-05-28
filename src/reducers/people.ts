/* eslint complexity: 0 */

import {
  DELETE_PERSON,
  LOGOUT,
  PEOPLE_WITH_ORG_SECTIONS,
  LOAD_PERSON_DETAILS,
  UPDATE_PERSON_ATTRIBUTES,
  GET_ORGANIZATION_PEOPLE,
} from '../constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Person = any;

export interface PeopleState {
  people: { [id: string]: Person };
}

const initialState: PeopleState = {
  people: {},
};

export default function peopleReducer(
  state = initialState,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: any,
): PeopleState {
  switch (action.type) {
    case LOAD_PERSON_DETAILS:
      return {
        ...state,
        people: {
          ...state.people,
          [action.person.id]: action.person,
        },
      };
    case UPDATE_PERSON_ATTRIBUTES:
      return {
        ...state,
        people: {
          ...state.people,
          [action.updatedPersonAttributes.id]: {
            ...state.people[action.updatedPersonAttributes.id],
            ...action.updatedPersonAttributes,
          },
        },
      };
    case DELETE_PERSON:
      return {
        ...state,
        people: filterObject(
          state.people,
          ([personId]) => personId !== action.personId,
        ),
      };
    case GET_ORGANIZATION_PEOPLE:
      return {
        ...state,
        people: action.response.reduce(
          (acc: PeopleState['people'], person: Person) => ({
            ...acc,
            [person.id]: { ...state.people[person.id], ...person },
          }),
          state.people,
        ),
      };
    case PEOPLE_WITH_ORG_SECTIONS:
      return {
        ...state,
        people: action.response.reduce(
          (acc: PeopleState['people'], person: Person) => ({
            ...acc,
            [person.id]: person,
          }),
          state.people,
        ),
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

function filterObject<T>(
  obj: { [key: string]: T },
  fn: (tuple: [string, T]) => boolean,
) {
  return Object.assign(
    {},
    ...Object.entries(obj)
      .filter(fn)
      .map(([id, element]) => ({ [id]: element })),
  );
}
