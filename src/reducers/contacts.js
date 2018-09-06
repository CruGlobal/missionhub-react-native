import {
  LOGOUT,
  ORGANIZATION_CONTACTS_SEARCH,
  LOAD_PERSON_DETAILS,
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
    case LOAD_PERSON_DETAILS:
      return loadPersonDetails(state, action);
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

function loadContacts(state, action) {
  const { orgId, contacts } = action;

  const org = state.allByOrg[orgId] || {};
  let contactsById = org.allById || {};
  contacts.forEach(c => {
    const e = contactsById[c.id];
    contactsById[c.id] = e ? { ...e, ...c } : c;
  });

  return {
    ...state,
    allByOrg: {
      ...state.allByOrg,
      [orgId]: {
        ...org,
        allById: contactsById,
      },
    },
  };
}

function loadPersonDetails(state, action) {
  const orgId = action.orgId || 'personal';
  const updatedPerson = action.person;
  const personId = updatedPerson.id;

  const org = state.allByOrg[orgId] || {};
  const contactsById = org.allById || {};

  return {
    ...state,
    allByOrg: {
      ...state.allByOrg,
      [orgId]: {
        ...org,
        id: orgId,
        allById: {
          ...contactsById,
          [personId]: { ...(contactsById[personId] || {}), ...updatedPerson },
        },
      },
    },
  };
}
