import { REQUESTS } from './api';
import callApi from './api';

export function getMyOrganizations() {
  return (dispatch) => {
    const query = {
      limit: 100,
    };
    return dispatch(callApi(REQUESTS.GET_MY_ORGANIZATIONS, query)).catch((error) => {
      LOG('error getting orgs', error);
    });
  };
}

export function getOrganizations(filters = {}) {
  return (dispatch) => {
    const query = {
      limit: 100,
      filters,
    };
    return dispatch(callApi(REQUESTS.GET_ORGANIZATIONS, query)).catch((error) => {
      LOG('error getting orgs', error);
    });
  };
}

export function addNewContact(data) {
  return (dispatch, getState) => {
    const myId = getState().auth.personId;
    if (!data || !data.firstName) {
      return Promise.reject('InvalidData', data);
    }
    let included = [];
    included.push({
      type: 'contact_assignment',
      attributes: {
        assigned_to_id: myId,
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
    return dispatch(callApi(REQUESTS.ADD_NEW_PERSON, query, bodyData)).catch((error) => {
      LOG('error adding new person', error);
    });
  };
}