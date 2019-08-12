/* eslint complexity: 0 */

import { REQUESTS } from '../api/routes';
import {
  DELETE_PERSON,
  LOGOUT,
  PEOPLE_WITH_ORG_SECTIONS,
  LOAD_PERSON_DETAILS,
  UPDATE_PERSON_ATTRIBUTES,
  GET_ORGANIZATION_PEOPLE,
} from '../constants';

import { Organization } from './organizations';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Person = any;

export interface PeopleState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  allByOrg: any;
}

const initialState: PeopleState = {
  allByOrg: {
    personal: { id: 'personal', people: {} },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function peopleReducer(state = initialState, action: any) {
  switch (action.type) {
    case LOAD_PERSON_DETAILS:
      const orgId = action.orgId || 'personal';
      const org = action.org || {};
      const currentOrg = state.allByOrg[orgId];
      return {
        ...state,
        allByOrg: {
          ...updateAllPersonInstances(state.allByOrg, action.person, true), // update existing people
          [orgId]: {
            // make sure person is added to specified org or create the org if it doesn't exist
            ...org,
            ...currentOrg,
            people: {
              ...(currentOrg ? currentOrg.people : {}),
              [action.person.id]: action.person,
            },
          },
        },
      };
    case UPDATE_PERSON_ATTRIBUTES:
      return {
        ...state,
        allByOrg: updateAllPersonInstances(
          state.allByOrg,
          action.updatedPersonAttributes,
        ),
      };
    case DELETE_PERSON:
      return {
        ...state,
        allByOrg: deletePersonInOrg(
          state.allByOrg,
          action.personId,
          action.personOrgId,
        ),
      };
    case GET_ORGANIZATION_PEOPLE:
      return loadPeople(state, action);
    case REQUESTS.GET_MY_CHALLENGES.SUCCESS:
      return loadContactsFromSteps(state, action);
    case LOGOUT:
      return initialState;
    case PEOPLE_WITH_ORG_SECTIONS:
      return {
        ...state,
        allByOrg: action.orgs,
      };
    default:
      return state;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadPeople(state: PeopleState, action: any) {
  const { response, orgId } = action;

  const org = state.allByOrg[orgId] || { id: orgId };
  const allPeople = org.people || {};
  response.forEach((person: Person) => {
    const existing = allPeople[person.id];
    allPeople[person.id] = existing ? { ...existing, ...person } : person;
  });

  return {
    ...state,
    allByOrg: {
      ...state.allByOrg,
      [orgId]: {
        ...org,
        people: allPeople,
      },
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadContactsFromSteps(state: PeopleState, action: any) {
  const { response } = action.results;

  const { allByOrg } = state;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response.forEach((s: any) => {
    if (!s) {
      return;
    }
    const orgId = (s.organization && s.organization.id) || 'personal';
    const receiver = s.receiver;
    if (!receiver) {
      return;
    }

    if (!allByOrg[orgId]) {
      allByOrg[orgId] = { people: {} };
    }

    const existingContact = allByOrg[orgId].people[receiver.id] || {};

    allByOrg[orgId].people[receiver.id] = {
      ...existingContact,
      ...receiver,
    };
  });

  return {
    ...state,
    allByOrg,
  };
}

function updateAllPersonInstances(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  allByOrg: any,
  updatedPerson: Person,
  replace = false,
) {
  return mapObject(allByOrg, ([orgId, org]: [string, Organization]) => ({
    [orgId]: {
      ...org,
      people: {
        ...org.people,
        ...(org.people[updatedPerson.id]
          ? {
              ...(replace
                ? { [updatedPerson.id]: updatedPerson }
                : {
                    [updatedPerson.id]: {
                      ...org.people[updatedPerson.id],
                      ...updatedPerson,
                    },
                  }),
            }
          : {}),
      },
    },
  }));
}

function deletePersonInOrg(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  allByOrg: any,
  deletePersonId: string,
  personOrgId = 'personal',
) {
  return mapObject(allByOrg, ([orgId, org]: [string, Organization]) => ({
    [orgId]: {
      ...org,
      people: {
        ...(orgId === personOrgId
          ? filterObject(
              org.people,
              ([personId]: [string]) => personId !== deletePersonId,
            )
          : org.people),
      },
    },
  }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapObject(obj: any, fn: (element: any) => any) {
  return Object.assign({}, ...Object.entries(obj).map(fn));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function filterObject(obj: any, fn: (element: any) => any) {
  return Object.assign(
    {},
    ...Object.entries(obj)
      .filter(fn)
      .map(([id, element]) => ({ [id]: element })),
  );
}
