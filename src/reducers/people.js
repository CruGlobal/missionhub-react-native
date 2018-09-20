import { REQUESTS } from '../actions/api';
import {
  DELETE_PERSON,
  LOGOUT,
  PEOPLE_WITH_ORG_SECTIONS,
  LOAD_PERSON_DETAILS,
  UPDATE_PERSON_ATTRIBUTES,
  GET_ORGANIZATION_PEOPLE,
} from '../constants';

const initialState = {
  allByOrg: {
    personal: { id: 'personal', people: {} },
  },
};

export default function peopleReducer(state = initialState, action) {
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

function loadPeople(state, action) {
  const { response, orgId } = action;

  const org = state.allByOrg[orgId] || {};
  const allPeople = org.people || {};
  response.forEach(person => {
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

function loadContactsFromSteps(state, action) {
  const { response } = action.results;

  const { allByOrg } = state;
  response.forEach(s => {
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

function updateAllPersonInstances(allByOrg, updatedPerson, replace = false) {
  return mapObject(allByOrg, ([orgId, org]) => ({
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

function deletePersonInOrg(allByOrg, deletePersonId, personOrgId = 'personal') {
  return mapObject(allByOrg, ([orgId, org]) => ({
    [orgId]: {
      ...org,
      people: {
        ...(orgId === personOrgId
          ? filterObject(
              org.people,
              ([personId]) => personId !== deletePersonId,
            )
          : org.people),
      },
    },
  }));
}

function mapObject(obj, fn) {
  return Object.assign({}, ...Object.entries(obj).map(fn));
}

function filterObject(obj, fn) {
  return Object.assign(
    {},
    ...Object.entries(obj)
      .filter(fn)
      .map(([id, element]) => ({ [id]: element })),
  );
}
