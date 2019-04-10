/* eslint max-lines: 0 */

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockDate from 'mockdate';

import {
  GET_ORGANIZATIONS_CONTACTS_REPORT,
  GET_ORGANIZATION_MEMBERS,
  GET_ORGANIZATION_PEOPLE,
  LOAD_ORGANIZATIONS,
  DEFAULT_PAGE_LIMIT,
  REMOVE_ORGANIZATION_MEMBER,
  ACTIONS,
  ORG_PERMISSIONS,
  ERROR_PERSON_PART_OF_ORG,
  GLOBAL_COMMUNITY_ID,
} from '../../constants';
import callApi, { REQUESTS } from '../api';
import { trackActionWithoutData } from '../analytics';
import {
  getMyOrganizations,
  refreshCommunity,
  getOrganizationsContactReports,
  getOrganizationContacts,
  getOrganizationMembers,
  getOrganizationMembersNextPage,
  addNewPerson,
  getMyCommunities,
  transferOrgOwnership,
  addNewOrganization,
  updateOrganization,
  updateOrganizationImage,
  deleteOrganization,
  lookupOrgCommunityCode,
  generateNewCode,
  removeOrganizationMember,
  generateNewLink,
  joinCommunity,
  lookupOrgCommunityUrl,
  updateCommentsNotification,
} from '../organizations';
import { getMe, getPersonDetails } from '../person';
import { removeHiddenOrgs } from '../../selectors/selectorUtils';

jest.mock('../analytics');
jest.mock('../../selectors/organizations');
jest.mock('../api');
jest.mock('../person');
jest.mock('../../selectors/selectorUtils');

global.FormData = require('FormData');

const myId = '1';

const mockStore = configureStore([thunk]);
let store;
const auth = { person: { user: {}, id: myId }, token: 'something' };

const getOrganizationsQuery = {
  limit: 100,
  include: '',
  filters: {
    descendants: false,
  },
  sort: 'name',
};
const communityOrgs = [
  { id: GLOBAL_COMMUNITY_ID, community: true },
  { id: '123', community: true },
  { id: 'non community', community: false },
  { id: '456', community: true },
];
const organization_ids = '123,456';

beforeEach(() => {
  store = mockStore({ auth, organizations: { all: [] } });
});

describe('getMyOrganizations', () => {
  const query = {
    limit: 100,
    include: '',
    filters: {
      descendants: false,
    },
    sort: 'name',
  };
  const org1 = { id: '1' };
  const org2 = { id: '2' };
  const org3 = { id: '3' };
  const org4 = { id: '4' };
  const org5 = { id: '5' };
  const org6 = { id: '6' };
  const org7 = { id: '7' };
  const org8 = { id: '8' };
  const orgs = [org1, org2, org3, org4, org5, org6, org7, org8];

  callApi.mockReturnValue(() => Promise.resolve({ response: orgs }));

  it('should get my organizations', async () => {
    await store.dispatch(getMyOrganizations());

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_ORGANIZATIONS, query);
    expect(store.getActions()).toEqual([
      {
        type: LOAD_ORGANIZATIONS,
        orgs: [org1, org2, org3, org4, org5, org6, org7, org8],
      },
    ]);
  });

  it('should sort by user order when specified', async () => {
    store = mockStore({
      auth: {
        person: {
          user: { organization_order: [org5.id, org4.id, org6.id, org3.id] },
        },
      },
    });

    await store.dispatch(getMyOrganizations());

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_ORGANIZATIONS, query);
    expect(store.getActions()).toEqual([
      {
        type: LOAD_ORGANIZATIONS,
        orgs: [org5, org4, org6, org3, org1, org2, org7, org8],
      },
    ]);
  });
});

describe('refreshCommunity', () => {
  const orgId = '11';
  const getOrganizationResponse = { type: 'get organization' };
  const getMeResponse = { type: 'get me' };

  it('should get organization data and user data', () => {
    callApi.mockReturnValue(getOrganizationResponse);
    getMe.mockReturnValue(getMeResponse);

    store.dispatch(refreshCommunity(orgId));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_ORGANIZATION, { orgId });
    expect(getMe).toHaveBeenCalledWith();
    expect(store.getActions()).toEqual([
      getOrganizationResponse,
      getMeResponse,
    ]);
  });

  it('should not get organization data and user data if global community', () => {
    callApi.mockReturnValue(getOrganizationResponse);
    getMe.mockReturnValue(getMeResponse);

    store.dispatch(refreshCommunity(GLOBAL_COMMUNITY_ID));

    expect(callApi).not.toHaveBeenCalled();
    expect(getMe).not.toHaveBeenCalled();
    expect(store.getActions()).toEqual([]);
  });
});

describe('getOrganizationsContactReports', () => {
  const contactReportsResponse = {
    type: 'successful',
    response: [
      {
        organization_id: '123',
        contact_count: 23,
        unassigned_count: 45,
        uncontacted_count: 67,
      },
      {
        organization_id: '456',
        contact_count: 89,
        unassigned_count: 10,
        uncontacted_count: 23,
      },
    ],
  };
  const contactReportsAction = {
    type: GET_ORGANIZATIONS_CONTACTS_REPORT,
    reports: [
      {
        id: contactReportsResponse.response[0].organization_id,
        contactsCount: contactReportsResponse.response[0].contact_count,
        unassignedCount: contactReportsResponse.response[0].unassigned_count,
        uncontactedCount: contactReportsResponse.response[0].uncontacted_count,
      },
      {
        id: contactReportsResponse.response[1].organization_id,
        contactsCount: contactReportsResponse.response[1].contact_count,
        unassignedCount: contactReportsResponse.response[1].unassigned_count,
        uncontactedCount: contactReportsResponse.response[1].uncontacted_count,
      },
    ],
  };

  beforeEach(async () => {
    store = mockStore({ auth, organizations: { all: communityOrgs } });
    callApi.mockReturnValue(contactReportsResponse);
    removeHiddenOrgs.mockReturnValue(communityOrgs);

    await store.dispatch(getOrganizationsContactReports());
  });

  it('calls removeHiddenOrgs', () => {
    expect(removeHiddenOrgs).toHaveBeenCalledWith(communityOrgs, auth.person);
  });

  it('makes API request GET_ORGANIZATION_INTERACTIONS_REPORT', () => {
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.GET_ORGANIZATION_INTERACTIONS_REPORT,
      {
        period: 'P1W',
        organization_ids: `${communityOrgs[1].id},${communityOrgs[3].id}`,
      },
    );
  });

  it('dispatches correct actions', () => {
    expect(store.getActions()).toEqual([
      contactReportsResponse,
      contactReportsAction,
    ]);
  });
});

describe('getOrganizationContacts', () => {
  MockDate.set('2018-08-22 12:00:00', 300);
  const name = 'name';
  const orgId = '123';
  const surveyId = '555';
  const surveyQuestions1 = { id: '123', text: '123Text', isAnswer: true };
  const surveyQuestions2 = { id: '456', text: '456Text', isAnswer: true };
  const filters = {
    gender: { id: 'Male' },
    archived: true,
    unassigned: true,
    uncontacted: true,
    labels: { id: '333' },
    groups: { id: '444' },
    survey: { id: surveyId },
    [surveyQuestions1.id]: surveyQuestions1,
    [surveyQuestions2.id]: surveyQuestions2,
    time: { id: 'time7', value: 7 },
  };
  const pagination = { page: 0, hasNextPage: true };
  const query = {
    filters: {
      permissions: 'no_permission',
      organization_ids: orgId,
      name: name,
      genders: filters.gender.id,
      include_archived: true,
      assigned_tos: 'unassigned',
      statuses: 'uncontacted',
      label_ids: filters.labels.id,
      group_ids: filters.groups.id,
      answer_sheets: {
        survey_ids: surveyId,
        answers: {
          [surveyQuestions1.id]: [surveyQuestions1.text],
          [surveyQuestions2.id]: [surveyQuestions2.text],
        },
        created_at: ['2018-08-15T00:00:00Z', '2018-08-22T23:59:59Z'],
      },
    },
    page: {
      limit: DEFAULT_PAGE_LIMIT,
      offset: 0,
    },
    include:
      'reverse_contact_assignments,reverse_contact_assignments.organization,organizational_permissions',
  };

  const response = [{ id: '1' }];
  const meta = { total: 1 };
  const apiResponse = { type: 'successful', response, meta };
  const getPeopleAction = {
    type: GET_ORGANIZATION_PEOPLE,
    orgId,
    response,
  };

  it('searches for org contacts by filters', async () => {
    callApi.mockReturnValue(apiResponse);

    await store.dispatch(
      getOrganizationContacts(orgId, name, pagination, filters),
    );

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_PEOPLE_LIST, query);
    expect(store.getActions()).toEqual([apiResponse, getPeopleAction]);
  });
});

describe('getOrganizationMembers', () => {
  const orgId = '123';
  const query = {
    filters: {
      permissions: 'owner,admin,user',
      organization_ids: orgId,
    },
    include: 'organizational_permissions,reverse_contact_assignments',
  };
  const members = [
    {
      name: 'person',
      id: '1',
    },
    {
      name: 'person',
      id: '2',
    },
  ];

  // Get reports endpoint
  const reportsQuery = {
    people_ids: members.map(m => m.id).join(','),
    period: 'P1Y',
    organization_ids: orgId,
  };
  const reports = [
    {
      person_id: '1',
      contact_count: 1,
      uncontacted_count: 1,
      contacts_with_interaction_count: 1,
    },
    {
      person_id: '2',
      contact_count: 1,
      uncontacted_count: 1,
      contacts_with_interaction_count: 1,
    },
  ];
  const finalMembers = members.map(m => ({
    ...m,
    contact_count: 1,
    uncontacted_count: 1,
    contacts_with_interaction_count: 1,
  }));

  // Final actions to be run
  const getMembersAction = {
    type: GET_ORGANIZATION_MEMBERS,
    members: finalMembers,
    orgId,
    meta: { total: 50 },
    query: query,
  };
  const getPeopleAction = {
    type: GET_ORGANIZATION_PEOPLE,
    response: finalMembers,
    orgId,
  };

  const peopleListResponse = {
    type: 'successful',
    response: members,
    meta: { total: 50 },
  };

  const reportsListResponse = {
    type: 'successful',
    response: reports,
  };

  it('should get members in organization', async () => {
    // Mock out the api.default to return different results based on the 2 API calls being made
    callApi.mockImplementation((...actualParams) => {
      if (actualParams[0].name === REQUESTS.GET_PEOPLE_LIST.name) {
        return peopleListResponse;
      } else if (
        actualParams[0].name === REQUESTS.GET_PEOPLE_INTERACTIONS_REPORT.name
      ) {
        return reportsListResponse;
      }
      return undefined;
    });

    await store.dispatch(getOrganizationMembers(orgId));

    expect(store.getActions()).toEqual([
      peopleListResponse,
      reportsListResponse,
      getMembersAction,
      getPeopleAction,
    ]);
  });

  it('should get members next page in organization', async () => {
    store = configureStore([thunk])({
      organizations: { membersPagination: { hasNextPage: true, page: 1 } },
    });
    const page = { limit: 25, offset: 25 };

    await store.dispatch(getOrganizationMembersNextPage(orgId));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_PEOPLE_LIST, {
      ...query,
      page,
    });
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.GET_PEOPLE_INTERACTIONS_REPORT,
      reportsQuery,
    );
    expect(store.getActions()).toEqual([
      peopleListResponse,
      reportsListResponse,
      { ...getMembersAction, query: { ...getMembersAction.query, page } },
      getPeopleAction,
    ]);
  });

  it('should get members next page in organization', async () => {
    store = configureStore([thunk])({
      organizations: { membersPagination: { hasNextPage: false, page: 1 } },
    });

    const result = await store.dispatch(getOrganizationMembersNextPage(orgId));
    expect(result).toEqual(undefined);
  });
});

describe('addNewPerson', () => {
  const firstName = 'Fred';
  let data = { firstName };
  let bodyData = {
    data: {
      type: 'person',
      attributes: {
        first_name: firstName,
        last_name: undefined,
        gender: undefined,
      },
    },
    included: [],
  };
  const apiResponse = { type: 'api response' };

  beforeEach(() => {
    callApi.mockReturnValue(apiResponse);
  });

  it('adds person with only first name', () => {
    store.dispatch(addNewPerson(data));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.ADD_NEW_PERSON, {}, bodyData);
  });

  it('adds person with includes', () => {
    const lastName = 'Smith';
    const gender = 'male';
    const orgId = '123';
    const orgPermission = { permission_id: '2' };
    const email = 'fred.smith@cru.org';
    const phone = '111-111-1111';

    data = {
      firstName,
      lastName,
      gender,
      orgId,
      orgPermission,
      email,
      phone,
      assignToMe: true,
    };
    bodyData = {
      data: {
        type: 'person',
        attributes: {
          first_name: firstName,
          last_name: lastName,
          gender,
        },
      },
      included: [
        {
          type: 'contact_assignment',
          attributes: {
            assigned_to_id: myId,
            organization_id: orgId,
          },
        },
        {
          type: 'organizational_permission',
          attributes: {
            organization_id: orgId,
            permission_id: orgPermission.permission_id,
          },
        },
        {
          type: 'email',
          attributes: { email },
        },
        {
          type: 'phone_number',
          attributes: {
            number: phone,
            location: 'mobile',
          },
        },
      ],
    };

    store.dispatch(addNewPerson(data));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.ADD_NEW_PERSON, {}, bodyData);
  });
});

describe('getMyCommunities', () => {
  const response = {
    type: 'successful',
    response: [{}],
  };

  beforeEach(async () => {
    store = mockStore({ auth, organizations: { all: communityOrgs } });

    callApi.mockReturnValue(response);
    await store.dispatch(getMyCommunities());
  });

  it('makes API request GET_ORGANIZATIONS', () => {
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.GET_ORGANIZATIONS,
      getOrganizationsQuery,
    );
  });

  it('makes API request GET_USERS_REPORT', () => {
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_USERS_REPORT);
  });

  it('makes API request GET_ORGANIZATION_INTERACTIONS_REPORT', () => {
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.GET_ORGANIZATION_INTERACTIONS_REPORT,
      {
        period: 'P1W',
        organization_ids,
      },
    );
  });

  it('dispatches correct actions', () => {
    expect(store.getActions()).toEqual([
      response,
      expect.objectContaining({ type: LOAD_ORGANIZATIONS }),
      response,
      response,
      expect.objectContaining({ type: GET_ORGANIZATIONS_CONTACTS_REPORT }),
    ]);
  });
});

describe('transferOrgOwnership', () => {
  const apiResponse = { type: 'api response' };
  const trackActionResponse = { type: 'track action' };
  const getMeResponse = { type: 'get me response' };
  const getPersonResponse = { type: 'get person response' };
  const orgId = '10292342';
  const person_id = '251689461';

  beforeEach(() => {
    callApi.mockReturnValue(apiResponse);
    trackActionWithoutData.mockReturnValue(trackActionResponse);
    getMe.mockReturnValue(getMeResponse);
    getPersonDetails.mockReturnValue(getPersonResponse);
  });

  it('transfers org ownership', async () => {
    await store.dispatch(transferOrgOwnership(orgId, person_id));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.TRANSFER_ORG_OWNERSHIP,
      { orgId },
      {
        data: {
          type: 'organization_ownership_transfer',
          attributes: { person_id },
        },
      },
    );
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.MANAGE_MAKE_OWNER,
    );
    expect(getMe).toHaveBeenCalledWith();
    expect(getPersonDetails).toHaveBeenCalledWith(person_id, orgId);

    expect(store.getActions()).toEqual([
      apiResponse,
      trackActionResponse,
      getMeResponse,
      getPersonResponse,
    ]);
  });
});

describe('addNewOrganization', () => {
  const orgId = '123';
  const name = 'Fred';
  const bodyData = {
    data: {
      type: 'organization',
      attributes: {
        name,
        user_created: true,
      },
    },
  };
  const apiResponse = { type: 'api response', response: { id: orgId } };
  const getMeResponse = { type: 'get me response' };
  const trackActionResponse = { type: 'track action' };

  beforeEach(() => {
    callApi.mockReturnValue(apiResponse);
    getMe.mockReturnValue(getMeResponse);
    trackActionWithoutData.mockReturnValue(trackActionResponse);
  });

  it('adds organization with name', async () => {
    await store.dispatch(addNewOrganization(name));

    expect(callApi).toHaveBeenCalledTimes(1);
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.ADD_NEW_ORGANIZATION,
      {},
      bodyData,
    );
    expect(trackActionWithoutData).toHaveBeenCalledTimes(1);
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.CREATE_COMMUNITY,
    );
    expect(getMe).toHaveBeenCalledWith();

    expect(store.getActions()).toEqual([
      apiResponse,
      trackActionResponse,
      getMeResponse,
    ]);
  });

  it('adds organization with name and image', async () => {
    const imageBodyData = new FormData();
    const testImageData = {
      uri: 'testuri',
      fileType: 'image/jpeg',
      fileName: 'filename',
    };
    imageBodyData.append('data[attributes][community_photo]', {
      uri: testImageData.uri,
      type: testImageData.fileType,
      name: testImageData.fileName,
    });

    await store.dispatch(addNewOrganization(name, testImageData));

    expect(callApi).toHaveBeenCalledTimes(2);
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.ADD_NEW_ORGANIZATION,
      {},
      bodyData,
    );
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UPDATE_ORGANIZATION_IMAGE,
      { orgId },
      imageBodyData,
    );
    expect(trackActionWithoutData).toHaveBeenCalledTimes(2);
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.CREATE_COMMUNITY,
    );
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.ADD_COMMUNITY_PHOTO,
    );
    expect(getMe).toHaveBeenCalledWith();

    expect(store.getActions()).toEqual([
      apiResponse,
      trackActionResponse,
      apiResponse,
      trackActionResponse,
      getMeResponse,
    ]);
  });
});

describe('updateOrganization', () => {
  const name = 'Fred';
  const orgId = '123';
  const nameBodyData = {
    data: {
      type: 'organization',
      attributes: {
        name,
      },
    },
  };
  const apiResponse = { type: 'api response' };

  beforeEach(() => {
    callApi.mockReturnValue(apiResponse);
  });

  it('update organization with name', () => {
    store.dispatch(updateOrganization(orgId, { name }));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UPDATE_ORGANIZATION,
      { orgId },
      nameBodyData,
    );
  });
});

describe('updateOrganizationImage', () => {
  const orgId = '123';
  const imageBodyData = new FormData();
  const testImageData = {
    uri: 'testuri',
    fileType: 'image/jpeg',
    fileName: 'filename',
  };
  imageBodyData.append('data[attributes][community_photo]', {
    uri: testImageData.uri,
    type: testImageData.fileType,
    name: testImageData.fileName,
  });
  const apiResponse = { type: 'api response' };

  beforeEach(() => {
    callApi.mockReturnValue(apiResponse);
  });

  it('update organization image', () => {
    store.dispatch(updateOrganizationImage(orgId, testImageData));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UPDATE_ORGANIZATION_IMAGE,
      { orgId },
      imageBodyData,
    );
  });
});

describe('deleteOrganization', () => {
  const orgId = '123';
  const apiResponse = { type: 'api response' };
  const trackActionResponse = { type: 'track action' };

  beforeEach(() => {
    callApi.mockReturnValue(apiResponse);
    trackActionWithoutData.mockReturnValue(trackActionResponse);
  });

  it('delete organization', async () => {
    await store.dispatch(deleteOrganization(orgId));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.DELETE_ORGANIZATION, {
      orgId,
    });
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.COMMUNITY_DELETE,
    );
  });
});

describe('lookupOrgCommunityCode', () => {
  const code = '123456';
  const orgId = '123';
  const query = { community_code: code };
  const ownerQuery = {
    filters: {
      permissions: 'owner',
      organization_ids: orgId,
    },
  };

  const response = { id: orgId };
  const apiResponse = { type: 'successful', response };
  const trackActionResponse = { type: 'track actions' };

  it('look up community by code', async () => {
    callApi.mockReturnValue(apiResponse);
    trackActionWithoutData.mockReturnValue(trackActionResponse);

    await store.dispatch(lookupOrgCommunityCode(code));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.LOOKUP_COMMUNITY_CODE, query);
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.SEARCH_COMMUNITY_WITH_CODE,
    );
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_PEOPLE_LIST, ownerQuery);
  });

  it('look up community by code no org returned', async () => {
    callApi.mockReturnValue({ type: 'error' });
    trackActionWithoutData.mockReturnValue(trackActionResponse);

    const result = await store.dispatch(lookupOrgCommunityCode(code));

    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.SEARCH_COMMUNITY_WITH_CODE,
    );
    expect(result).toBe(null);
  });
});

describe('lookupOrgCommunityUrl', () => {
  const urlCode = '1234567890123456';
  const orgId = '123';
  const query = { community_url: urlCode };
  const ownerQuery = {
    filters: {
      permissions: 'owner',
      organization_ids: orgId,
    },
  };

  const response = { id: orgId };
  const apiResponse = { type: 'successful', response };
  const trackActionResponse = { type: 'track actions' };

  it('look up community by url code', async () => {
    callApi.mockReturnValue(apiResponse);
    trackActionWithoutData.mockReturnValue(trackActionResponse);

    await store.dispatch(lookupOrgCommunityUrl(urlCode));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.LOOKUP_COMMUNITY_URL, query);
    // expect(trackActionWithoutData).toHaveBeenCalledWith(
    //   ACTIONS.SEARCH_COMMUNITY_WITH_CODE,
    // );
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_PEOPLE_LIST, ownerQuery);
  });

  it('look up community by url code no org returned', async () => {
    callApi.mockReturnValue({ type: 'error' });
    trackActionWithoutData.mockReturnValue(trackActionResponse);

    const result = await store.dispatch(lookupOrgCommunityUrl(urlCode));

    // expect(trackActionWithoutData).toHaveBeenCalledWith(
    //   ACTIONS.SEARCH_COMMUNITY_WITH_CODE,
    // );
    expect(result).toBe(null);
  });
});

describe('joinCommunity', () => {
  const orgId = '123';
  const code = 'code';
  const url = 'url';
  const apiResponse = { type: 'api response' };
  const trackActionResponse = { type: 'track action' };
  const attr = {
    organization_id: orgId,
    permission_id: ORG_PERMISSIONS.USER,
    person_id: myId,
  };
  const data = {
    type: 'organizational_permission',
  };

  beforeEach(() => {
    callApi.mockReturnValue(apiResponse);
    trackActionWithoutData.mockReturnValue(trackActionResponse);
  });

  it('join community with code', async () => {
    const attributes = { ...attr, community_code: code };
    await store.dispatch(joinCommunity(orgId, code));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.JOIN_COMMUNITY,
      {},
      { data: { ...data, attributes } },
    );
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.JOIN_COMMUNITY_WITH_CODE,
    );
  });

  it('join community with url', async () => {
    const attributes = { ...attr, community_url: url };
    await store.dispatch(joinCommunity(orgId, undefined, url));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.JOIN_COMMUNITY,
      {},
      { data: { ...data, attributes } },
    );
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.JOIN_COMMUNITY_WITH_CODE,
    );
  });

  it('should swallow API error if the user is already member', async () => {
    callApi.mockReturnValue(() =>
      Promise.reject({
        apiError: { errors: [{ detail: ERROR_PERSON_PART_OF_ORG }] },
      }),
    );
    await store.dispatch(joinCommunity(orgId, code));

    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.JOIN_COMMUNITY_WITH_CODE,
    );
  });

  it('should pass on API error if the error is unrelated to preexisting membership ', () => {
    callApi.mockReturnValue(() =>
      Promise.reject({
        apiError: { errors: [{ detail: 'some error' }] },
      }),
    );
    expect(store.dispatch(joinCommunity(orgId, code))).rejects.toThrow();
  });
});

describe('generateNewCode', () => {
  const orgId = '123';
  const apiResponse = { type: 'api response' };
  const trackActionResponse = { type: 'track action' };

  beforeEach(() => {
    callApi.mockReturnValue(apiResponse);
    trackActionWithoutData.mockReturnValue(trackActionResponse);
  });

  it('get new code for organization', async () => {
    await store.dispatch(generateNewCode(orgId));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.ORGANIZATION_NEW_CODE, {
      orgId,
    });
    expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.NEW_CODE);
  });
});

describe('generateNewLink', () => {
  const orgId = '123';
  const apiResponse = { type: 'api response' };
  const trackActionResponse = { type: 'track action' };

  beforeEach(() => {
    callApi.mockReturnValue(apiResponse);
    trackActionWithoutData.mockReturnValue(trackActionResponse);
  });

  it('get new url for organization', async () => {
    await store.dispatch(generateNewLink(orgId));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.ORGANIZATION_NEW_LINK, {
      orgId,
    });
    expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.NEW_INVITE_URL);
  });
});

describe('removeOrganizationMember', () => {
  const personId = '234234';
  const orgId = '48973546';

  it('creates the correct action', () => {
    expect(removeOrganizationMember(personId, orgId)).toEqual({
      type: REMOVE_ORGANIZATION_MEMBER,
      personId,
      orgId,
    });
  });
});

describe('updateCommentNotification', () => {
  const APIResponse = {
    type: 'successful',
    response: [{}],
  };
  const getMeResponse = { type: 'get me' };

  beforeEach(async () => {
    store = mockStore({ auth, organizations: { all: communityOrgs } });

    callApi.mockReturnValue(APIResponse);
    getMe.mockReturnValue(getMeResponse);
    await store.dispatch(updateCommentsNotification());
  });

  it('calls getMe', () => {
    expect(getMe).toHaveBeenCalled();
  });

  it('makes API request GET_ORGANIZATIONS', () => {
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.GET_ORGANIZATIONS,
      getOrganizationsQuery,
    );
  });

  it('makes API request GET_USERS_REPORT', () => {
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_USERS_REPORT);
  });

  it('makes API request GET_ORGANIZATION_INTERACTIONS_REPORT', () => {
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.GET_ORGANIZATION_INTERACTIONS_REPORT,
      {
        period: 'P1W',
        organization_ids,
      },
    );
  });

  it('dispatches correct actions', () => {
    expect(store.getActions()).toEqual([
      getMeResponse,
      APIResponse,
      expect.objectContaining({ type: LOAD_ORGANIZATIONS }),
      APIResponse,
      APIResponse,
      expect.objectContaining({ type: GET_ORGANIZATIONS_CONTACTS_REPORT }),
    ]);
  });
});
