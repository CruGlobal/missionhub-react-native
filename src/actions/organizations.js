import { REQUESTS } from './api';
import callApi from './api';

const getOrganizationsQuery = {
  limit: 100,
  include: '',
};

export function getMyOrganizations() {
  return getOrganizations(REQUESTS.GET_MY_ORGANIZATIONS, getOrganizationsQuery);
}

export function getAssignedOrganizations() {
  const query = {
    ...getOrganizationsQuery,
    filters: { assigned_tos: 'me' },
  };

  return getOrganizations(REQUESTS.GET_ORGANIZATIONS, query);
}

function getOrganizations(requestObject, query) {
  return async dispatch => {
    const { response } = await dispatch(callApi(requestObject, query));
    response.forEach(o => dispatch(getOrganizationContactsCount(o.id)));
    return response;
  };
}

function getOrganizationContactsCount(orgId) {
  const query = {
    organization_id: orgId,
    include_unassigned: true,
  };
  return dispatch => {
    dispatch(callApi(REQUESTS.GET_CONTACTS_COUNT, query));
  };
}

function getOrganizationPeople(orgId) {
  const query = {
    organization_id: orgId,
    include:
      'reverse_contact_assignments,reverse_contact_assignments.organization,organizational_permissions',
  };
  return dispatch => dispatch(callApi(REQUESTS.GET_PEOPLE_LIST, query));
}

export function addNewContact(data) {
  return (dispatch, getState) => {
    const {
      person: { id: myId },
    } = getState().auth;
    if (!data || !data.firstName) {
      return Promise.reject('InvalidData', data);
    }
    let included = [];
    included.push({
      type: 'contact_assignment',
      attributes: {
        assigned_to_id: myId,
        organization_id: data.orgId || undefined,
      },
    });
    if (data.orgId) {
      included.push({
        type: 'organizational_permission',
        attributes: { organization_id: data.orgId },
      });
    }
    if (data.email) {
      included.push({
        type: 'email',
        attributes: { email: data.email },
      });
    }
    if (data.phone) {
      included.push({
        type: 'phone_number',
        attributes: {
          number: data.phone,
          location: 'mobile',
        },
      });
    }
    const bodyData = {
      data: {
        type: 'person',
        attributes: {
          first_name: data.firstName,
          last_name: data.lastName || undefined,
          gender: data.gender || undefined,
        },
      },
      included,
    };
    const query = {};
    return dispatch(callApi(REQUESTS.ADD_NEW_PERSON, query, bodyData));
  };
}
