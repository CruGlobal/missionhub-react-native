import { DELETE_PERSON, LOGOUT, PEOPLE_WITH_ORG_SECTIONS, LOAD_PERSON_DETAILS, UPDATE_PERSON_ATTRIBUTES } from '../constants';

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
          [ orgId ]: { // make sure person is added to specified org or create the org if it doesn't exist
            ...org,
            ...currentOrg,
            people: {
              ...currentOrg ? currentOrg.people : {},
              [ action.person.id ]: action.person,
            },
          },
        },
      };
    case UPDATE_PERSON_ATTRIBUTES:
      return {
        ...state,
        allByOrg: updateAllPersonInstances(state.allByOrg, action.updatedPersonAttributes),
      };
    case DELETE_PERSON:
      return {
        ...state,
        allByOrg: deletePersonInOrg(state.allByOrg, action.personId, action.personOrgId),
      };
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

function updateAllPersonInstances(allByOrg, updatedPerson, replace = false) {
  return mapObject(allByOrg, ([ orgId, org ]) => ({
    [orgId]: {
      ...org,
      people: {
        ...org.people,
        ...org.people[updatedPerson.id] ?
          {
            ...replace ?
              { [updatedPerson.id]: updatedPerson } :
              { [updatedPerson.id]: { ...org.people[updatedPerson.id], ...updatedPerson } },
          } :
          {},
      },
    },
  }));
}

function deletePersonInOrg(allByOrg, deletePersonId, personOrgId = 'personal') {
  return mapObject(allByOrg, ([ orgId, org ]) => ({
    [orgId]: {
      ...org,
      people: {
        ...orgId === personOrgId ?
          filterObject(org.people, ([ personId ]) => personId !== deletePersonId) :
          org.people,
      },
    },
  }));
}

function mapObject(obj, fn) {
  return Object.assign({}, ...Object.entries(obj).map(fn));
}

function filterObject(obj, fn) {
  return Object.assign({}, ...Object.entries(obj).filter(fn).map(([ id, element ]) => ({ [id]: element })));
}
