import { REHYDRATE } from 'redux-persist/constants';

import { REQUESTS } from '../actions/api';
import { DELETE_PERSON, LOGOUT, PEOPLE_WITH_ORG_SECTIONS, UPDATE_PERSON_ATTRIBUTES } from '../constants';
import { useFirstExists } from '../utils/common';

const initialState = {
  allByOrg: {},
};

function peopleReducer(state = initialState, action) {
  switch (action.type) {
    case REHYDRATE:
      const incoming = action.payload.people;
      if (incoming) {
        return {
          allByOrg: useFirstExists(incoming.allByOrg, state.allByOrg),
        };
      }
      return state;
    case REQUESTS.GET_PERSON.SUCCESS:
      const updatedPerson = action.results.response;
      return {
        ...state,
        allByOrg: updateAllPersonInstances(state.allByOrg, updatedPerson, true),
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

function deletePersonInOrg(allByOrg, deletePersonId, personOrgId) {
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

export default peopleReducer;
