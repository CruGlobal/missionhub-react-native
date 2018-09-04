import {
  LOGOUT,
  ORGANIZATION_CONTACTS_SEARCH,
  UPDATE_PERSON_ATTRIBUTES,
} from '../constants';

const initialState = {
  allByOrg: {
    personal: { id: 'personal', allById: {} },
  },
};

export default function contactsReducer(state = initialState, action) {
  switch (action.type) {
    case ORGANIZATION_CONTACTS_SEARCH:
      return loadContacts(state, action);
    case UPDATE_PERSON_ATTRIBUTES:
      return updatePerson(state, action);
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

function loadContacts(state, action) {
  const { orgId, contacts } = action;
  const org = state.allByOrg[orgId] || { id: orgId, allById: {} };

  contacts.forEach(c => {
    const e = org.allById[c.id];
    org.allById[c.id] = e ? { ...e, ...c } : c;
  });

  return {
    ...state,
    allByOrg: {
      ...state.allByOrg,
      [orgId]: org,
    },
  };
}

function updatePerson(state, action) {
  return {
    ...state,
    allByOrg: updateAllPersonInstances(
      state.allByOrg,
      action.updatedPersonAttributes,
    ),
  };
}

function updateAllPersonInstances(allByOrg, updatedPerson, replace = false) {
  return mapObject(allByOrg, ([orgId, org]) => ({
    [orgId]: {
      ...org,
      allById: {
        ...org.allById,
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

function mapObject(obj, fn) {
  return Object.assign({}, ...Object.entries(obj).map(fn));
}
