/* eslint-disable max-lines, @typescript-eslint/no-explicit-any */

import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import {
  ACTIONS,
  ORG_PERMISSIONS,
  ERROR_PERSON_PART_OF_ORG,
  GLOBAL_COMMUNITY_ID,
  LOAD_ORGANIZATIONS,
} from '../constants';
import { REQUESTS } from '../api/routes';
import { Organization, OrganizationsState } from '../reducers/organizations';
import { apolloClient } from '../apolloClient';
import { GET_COMMUNITIES_QUERY } from '../containers/Groups/queries';
import { RootState } from '../reducers';
import { isAuthenticated } from '../auth/authStore';
import { getAuthPerson } from '../auth/authUtilities';

import { getMe, getPersonDetails } from './person';
import callApi from './api';
import { trackActionWithoutData } from './analytics';

interface PersonInteractionReport {
  person_id: string;
  contact_count: number;
  unassigned_count: number;
  uncontacted_count: number;
  contacts_with_interaction_count: number;
}
export interface ImageData {
  fileSize: number;
  fileName: string;
  fileType: string;
  width: number;
  height: number;
  isVertical: boolean;
  uri: string;
}

const getOrganizationsQuery = {
  limit: 100,
  include: '',
  filters: {
    descendants: false,
  },
  sort: 'name',
};

export function getMyCommunities() {
  return (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
    apolloClient.query({ query: GET_COMMUNITIES_QUERY });
    dispatch(getMyOrganizations());
  };
}

export function getMyOrganizations() {
  return async (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
    const orgs: Organization[] = (
      await dispatch(callApi(REQUESTS.GET_ORGANIZATIONS, getOrganizationsQuery))
    ).response;

    dispatch({
      type: LOAD_ORGANIZATIONS,
      orgs,
    });
  };
}

function getOrganization(orgId: string) {
  return (dispatch: ThunkDispatch<RootState, never, AnyAction>) =>
    dispatch(callApi(REQUESTS.GET_ORGANIZATION, { orgId }));
}

export function refreshCommunity(orgId: string = GLOBAL_COMMUNITY_ID) {
  return async (
    dispatch: ThunkDispatch<RootState, never, AnyAction>,
    getState: () => { organizations: OrganizationsState },
  ) => {
    if (orgId === GLOBAL_COMMUNITY_ID) {
      return getState().organizations.all.find(
        o => o.id === GLOBAL_COMMUNITY_ID,
      );
    }

    //Refresh Community Data
    const { response } = await dispatch(getOrganization(orgId));
    //Refresh user org permissions
    // @ts-ignore
    dispatch(getMe());

    return response;
  };
}

export function updateOrganization(orgId: string, data: { name: string }) {
  return async (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
    if (!data) {
      return Promise.reject(
        'Invalid Data from updateOrganization: no data passed in',
      );
    }
    const bodyData = {
      data: {
        type: 'organization',
        attributes: {
          name: data.name,
        },
      },
    };
    const query = { orgId };

    await dispatch(callApi(REQUESTS.UPDATE_ORGANIZATION, query, bodyData));
    dispatch(getMyCommunities());
  };
}

export function updateOrganizationImage(orgId: string, imageData: ImageData) {
  return (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
    if (!imageData) {
      return Promise.reject(
        'Invalid Data from updateOrganizationImage: no image data passed in',
      );
    }

    const data = new FormData();

    data.append('data[attributes][community_photo]', ({
      uri: imageData.uri,
      type: imageData.fileType,
      name: imageData.fileName,
    } as unknown) as Blob);

    const results = dispatch(
      callApi(REQUESTS.UPDATE_ORGANIZATION_IMAGE, { orgId }, data),
    );
    dispatch(getMyCommunities());

    return results;
  };
}

export function transferOrgOwnership(orgId: string, person_id: string) {
  return async (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
    const { response } = await dispatch(
      callApi(
        REQUESTS.TRANSFER_ORG_OWNERSHIP,
        { orgId },
        {
          data: {
            type: 'organization_ownership_transfer',
            attributes: { person_id },
          },
        },
      ),
    );
    dispatch(trackActionWithoutData(ACTIONS.MANAGE_MAKE_OWNER));

    // After transfer, update auth person and other person with new org permissions
    // @ts-ignore
    dispatch(getMe());
    dispatch(getPersonDetails(person_id));

    return response;
  };
}

export function addNewOrganization(name: string, imageData?: ImageData) {
  return async (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
    if (!name) {
      return Promise.reject(
        'Invalid Data from addNewOrganization: no org name passed in',
      );
    }
    const bodyData = {
      data: {
        type: 'organization',
        attributes: {
          name,
        },
      },
    };
    const query = {};
    const results = await dispatch(
      callApi(REQUESTS.ADD_NEW_ORGANIZATION, query, bodyData),
    );
    dispatch(trackActionWithoutData(ACTIONS.CREATE_COMMUNITY));

    if (imageData) {
      // After the org is created, update the image with the image data passed in
      const newOrgId = results.response.id;
      await dispatch(updateOrganizationImage(newOrgId, imageData));
      dispatch(trackActionWithoutData(ACTIONS.ADD_COMMUNITY_PHOTO));
    } else {
      dispatch(getMyCommunities());
    }
    // After the org is created, update auth person with new org permissions
    // @ts-ignore
    dispatch(getMe());

    return results;
  };
}

export function deleteOrganization(orgId: string) {
  return async (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
    const query = { orgId };
    await dispatch(callApi(REQUESTS.DELETE_ORGANIZATION, query));
    dispatch(trackActionWithoutData(ACTIONS.COMMUNITY_DELETE));
    dispatch(getMyCommunities());
  };
}

export function lookupOrgCommunityCode(code: string) {
  return async (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
    const query = { community_code: code };
    const { response: org = {} } = await dispatch(
      callApi(REQUESTS.LOOKUP_COMMUNITY_CODE, query),
    );
    dispatch(trackActionWithoutData(ACTIONS.SEARCH_COMMUNITY_WITH_CODE));

    if (!org.id) {
      return null;
    }

    if (isAuthenticated()) {
      const orgWithOwner = await dispatch(getOwner(org));

      // No need to get member count anymore since it's an authenticated route
      // Leaving this code here in case we change that route to be unauthenticated
      // get the report information and append it to the org
      // const reportQuery = {
      //   organization_ids: org.id,
      //   period: 'P1W',
      // };
      // const { response: reports } = await dispatch(
      //   callApi(REQUESTS.GET_ORGANIZATION_INTERACTIONS_REPORT, reportQuery),
      // );

      // const report = reports[0] || {};
      // org.contactReport = {
      //   contactsCount: report.contact_count,
      //   unassignedCount: report.unassigned_count,
      //   uncontactedCount: report.uncontacted_count,
      //   memberCount: report.member_count,
      // };

      return orgWithOwner;
    }

    return org;
  };
}

export function lookupOrgCommunityUrl(urlCode: string) {
  return async (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
    const query = { community_url: urlCode };
    const { response: org = {} } = await dispatch(
      callApi(REQUESTS.LOOKUP_COMMUNITY_URL, query),
    );
    // dispatch(trackActionWithoutData(ACTIONS.SEARCH_COMMUNITY_WITH_CODE)); // TODO: implement Url version

    if (!org.id) {
      return null;
    }

    if (isAuthenticated()) {
      const orgWithOwner = await dispatch(getOwner(org));

      return orgWithOwner;
    }

    return org;
  };
}

function getOwner(org: Organization) {
  return async (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
    // get the owner information and append it to the org
    const ownerQuery = {
      filters: {
        permissions: 'owner',
        organization_ids: org.id,
      },
    };
    const { response: ownerResponse } = await dispatch(
      callApi(REQUESTS.GET_PEOPLE_LIST, ownerQuery),
    );
    org.owner = ownerResponse[0];
    return { ...org, owner: ownerResponse[0] };
  };
}

export function joinCommunity(orgId: string, code?: string, url?: string) {
  return async (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
    const myId = getAuthPerson().id;
    const attributes: { [key: string]: string | undefined } = {
      organization_id: orgId,
      permission_id: ORG_PERMISSIONS.USER,
    };
    if (code) {
      attributes.community_code = code;
    } else if (url) {
      attributes.community_url = url;
    } else {
      return Promise.reject(
        'Invalid Data from joinCommunity: must pass in a code or url',
      );
    }
    attributes.person_id = myId;
    const bodyData = {
      data: {
        type: 'organizational_permission',
        attributes,
      },
    };

    try {
      await dispatch(callApi(REQUESTS.JOIN_COMMUNITY, {}, bodyData));
    } catch (error) {
      // If the user is already part of the organization, just continue like normal
      if (
        !(
          error &&
          error.apiError &&
          error.apiError.errors &&
          error.apiError.errors[0] &&
          error.apiError.errors[0].detail === ERROR_PERSON_PART_OF_ORG
        )
      ) {
        throw error;
      }
    }

    dispatch(trackActionWithoutData(ACTIONS.JOIN_COMMUNITY_WITH_CODE));
    dispatch(getMyCommunities());
  };
}

export function generateNewCode(orgId: string) {
  return async (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
    const results = await dispatch(
      callApi(REQUESTS.ORGANIZATION_NEW_CODE, { orgId }),
    );
    dispatch(trackActionWithoutData(ACTIONS.NEW_CODE));

    return results;
  };
}

export function generateNewLink(orgId: string) {
  return async (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
    const results = await dispatch(
      callApi(REQUESTS.ORGANIZATION_NEW_LINK, { orgId }),
    );
    dispatch(trackActionWithoutData(ACTIONS.NEW_INVITE_URL));

    return results;
  };
}
