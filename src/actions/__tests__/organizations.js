/* eslint max-lines: 0 */

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockDate from 'mockdate';

import {
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
import callApi from '../api';
import { REQUESTS } from '../../api/routes';
import { trackActionWithoutData } from '../analytics';
import {
  getMyOrganizations,
  refreshCommunity,
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
  navigateToCommunity,
  navigateToCelebrateComments,
} from '../organizations';
import { getMe, getPersonDetails } from '../person';
import {
  navigateReset,
  navigatePush,
  navigateNestedReset,
} from '../navigation';
import {
  GROUP_CHALLENGES,
  GROUP_SCREEN,
  USER_CREATED_GROUP_SCREEN,
  GLOBAL_GROUP_SCREEN,
} from '../../containers/Groups/GroupScreen';
import { GROUP_UNREAD_FEED_SCREEN } from '../../containers/Groups/GroupUnreadFeed';
import { CELEBRATE_DETAIL_SCREEN } from '../../containers/CelebrateDetailScreen';
import { apolloClient } from '../../apolloClient';
import { GET_COMMUNITIES_QUERY } from '../../containers/Groups/GroupsListScreen';

jest.mock('../analytics');
jest.mock('../api');
jest.mock('../person');
jest.mock('../challenges');
jest.mock('../navigation');
jest.mock('../../selectors/selectorUtils');

global.FormData = require('react-native/Libraries/Network/FormData');

apolloClient.query = jest.fn();

const myId = '1';

const mockStore = configureStore([thunk]);
let store;
const globalCommunity = {
  id: GLOBAL_COMMUNITY_ID,
  name: 'MissionHub Community',
};
const organizations = { all: [globalCommunity] };
const auth = { person: { user: {}, id: myId }, token: 'something' };
const query = {
  limit: 100,
  include: '',
  filters: {
    descendants: false,
  },
  sort: 'name',
};

beforeEach(() => {
  store = mockStore({ auth, organizations });
});

describe('getMyCommunities', () => {
  it('should get my communities', async () => {
    const org1 = { id: '1' };
    const callApiResponse = {
      type: 'call Api',
      response: [org1],
    };
    callApi.mockReturnValue(callApiResponse);

    await store.dispatch(getMyCommunities());

    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_COMMUNITIES_QUERY,
      fetchPolicy: 'cache-and-network',
    });
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_ORGANIZATIONS, query);
    expect(store.getActions()).toEqual([
      callApiResponse,
      {
        type: LOAD_ORGANIZATIONS,
        orgs: [org1],
      },
    ]);
  });
});

describe('getMyOrganizations', () => {
  const org1 = { id: '1' };
  const org2 = { id: '2' };
  const org3 = { id: '3' };
  const org4 = { id: '4' };
  const org5 = { id: '5' };
  const org6 = { id: '6' };
  const org7 = { id: '7' };
  const org8 = { id: '8' };
  const orgs = [org1, org2, org3, org4, org5, org6, org7, org8];

  beforeEach(() => {
    callApi.mockReturnValue(() => Promise.resolve({ response: orgs }));
  });

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
  const getOrganizationResponse = {
    type: 'get organization',
    response: { id: orgId, name: 'test' },
  };
  const getMeResponse = { type: 'get me' };

  beforeEach(() => {
    callApi.mockReturnValue(getOrganizationResponse);
    getMe.mockReturnValue(getMeResponse);
  });

  it('should get organization data and user data', async () => {
    const response = await store.dispatch(refreshCommunity(orgId));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_ORGANIZATION, { orgId });
    expect(getMe).toHaveBeenCalledWith();
    expect(response).toEqual(getOrganizationResponse.response);
    expect(store.getActions()).toEqual([
      getOrganizationResponse,
      getMeResponse,
    ]);
  });

  it('should not get organization data and user data if global community', async () => {
    const response = await store.dispatch(
      refreshCommunity(GLOBAL_COMMUNITY_ID),
    );

    expect(callApi).not.toHaveBeenCalled();
    expect(getMe).not.toHaveBeenCalled();
    expect(response).toEqual(globalCommunity);
    expect(store.getActions()).toEqual([]);
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
    includeUsers: true,
  };
  const pagination = { page: 0, hasNextPage: true };
  const defaultQuery = {
    filters: {
      name: name,
      organization_ids: orgId,
      permissions: 'no_permission',
    },
    page: {
      limit: DEFAULT_PAGE_LIMIT,
      offset: 0,
    },
    include:
      'reverse_contact_assignments,reverse_contact_assignments.organization,organizational_permissions',
  };
  const query = {
    filters: {
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

  it('searches for org contacts by default filters', async () => {
    callApi.mockReturnValue(apiResponse);

    await store.dispatch(getOrganizationContacts(orgId, name, pagination));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.GET_PEOPLE_LIST,
      defaultQuery,
    );
    expect(store.getActions()).toEqual([apiResponse, getPeopleAction]);
  });

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
  const org = { id: '123' };
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
  const getOrgsQuery = {
    limit: 100,
    include: '',
    filters: {
      descendants: false,
    },
    sort: 'name',
  };
  const orgs = [org];

  const addOrgApiResponse = { type: 'add org api response', response: org };
  const updateOrgApiResponse = {
    type: 'update org  api response',
    response: org,
  };
  const getOrgsApiResponse = { type: 'get orgs api response', response: orgs };
  const getMeResponse = { type: 'get me response' };
  const trackActionResponse = { type: 'track action' };

  beforeEach(() => {
    callApi.mockImplementation(type => {
      switch (type) {
        case REQUESTS.ADD_NEW_ORGANIZATION:
          return addOrgApiResponse;
        case REQUESTS.UPDATE_ORGANIZATION_IMAGE:
          return updateOrgApiResponse;
        case REQUESTS.GET_ORGANIZATIONS:
          return getOrgsApiResponse;
      }
    });
    getMe.mockReturnValue(getMeResponse);
    trackActionWithoutData.mockReturnValue(trackActionResponse);
  });

  it('adds organization with name', async () => {
    await store.dispatch(addNewOrganization(name));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.ADD_NEW_ORGANIZATION,
      {},
      bodyData,
    );
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.GET_ORGANIZATIONS,
      getOrgsQuery,
    );
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.CREATE_COMMUNITY,
    );
    expect(getMe).toHaveBeenCalledWith();
    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_COMMUNITIES_QUERY,
      fetchPolicy: 'cache-and-network',
    });
    expect(store.getActions()).toEqual([
      addOrgApiResponse,
      trackActionResponse,
      getOrgsApiResponse,
      getMeResponse,
      {
        type: LOAD_ORGANIZATIONS,
        orgs: [org],
      },
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

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.ADD_NEW_ORGANIZATION,
      {},
      bodyData,
    );
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UPDATE_ORGANIZATION_IMAGE,
      { orgId: org.id },
      imageBodyData,
    );
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.GET_ORGANIZATIONS,
      getOrgsQuery,
    );
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.CREATE_COMMUNITY,
    );
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.ADD_COMMUNITY_PHOTO,
    );
    expect(getMe).toHaveBeenCalledWith();
    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_COMMUNITIES_QUERY,
      fetchPolicy: 'cache-and-network',
    });
    expect(store.getActions()).toEqual([
      addOrgApiResponse,
      trackActionResponse,
      updateOrgApiResponse,
      getOrgsApiResponse,
      {
        type: LOAD_ORGANIZATIONS,
        orgs,
      },
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
  const apiResponse = { type: 'api response', response: [] };

  beforeEach(() => {
    callApi.mockReturnValue(apiResponse);
  });

  it('update organization with name', async () => {
    await store.dispatch(updateOrganization(orgId, { name }));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UPDATE_ORGANIZATION,
      { orgId },
      nameBodyData,
    );
    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_COMMUNITIES_QUERY,
      fetchPolicy: 'cache-and-network',
    });
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_ORGANIZATIONS, query);
    expect(store.getActions()).toEqual([
      apiResponse,
      apiResponse,
      {
        type: LOAD_ORGANIZATIONS,
        orgs: [],
      },
    ]);
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
  const apiResponse = { type: 'api response', response: [] };

  beforeEach(() => {
    callApi.mockReturnValue(apiResponse);
  });

  it('update organization image', async () => {
    await store.dispatch(updateOrganizationImage(orgId, testImageData));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.UPDATE_ORGANIZATION_IMAGE,
      { orgId },
      imageBodyData,
    );
    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_COMMUNITIES_QUERY,
      fetchPolicy: 'cache-and-network',
    });
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_ORGANIZATIONS, query);
    expect(store.getActions()).toEqual([
      apiResponse,
      apiResponse,
      {
        type: LOAD_ORGANIZATIONS,
        orgs: [],
      },
    ]);
  });
});

describe('deleteOrganization', () => {
  const orgId = '123';
  const apiResponse = { type: 'api response', response: [] };
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
    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_COMMUNITIES_QUERY,
      fetchPolicy: 'cache-and-network',
    });
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_ORGANIZATIONS, query);
    expect(store.getActions()).toEqual([
      apiResponse,
      trackActionResponse,
      apiResponse,
      {
        type: LOAD_ORGANIZATIONS,
        orgs: [],
      },
    ]);
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
  const apiResponse = { type: 'api response', response: [] };
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
    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_COMMUNITIES_QUERY,
      fetchPolicy: 'cache-and-network',
    });
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_ORGANIZATIONS, query);
    expect(store.getActions()).toEqual([
      apiResponse,
      trackActionResponse,
      apiResponse,
      {
        type: LOAD_ORGANIZATIONS,
        orgs: [],
      },
    ]);
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
    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_COMMUNITIES_QUERY,
      fetchPolicy: 'cache-and-network',
    });
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_ORGANIZATIONS, query);
    expect(store.getActions()).toEqual([
      apiResponse,
      trackActionResponse,
      apiResponse,
      {
        type: LOAD_ORGANIZATIONS,
        orgs: [],
      },
    ]);
  });

  it('should swallow API error if the user is already member', async () => {
    callApi.mockImplementation(type =>
      type === REQUESTS.JOIN_COMMUNITY
        ? () =>
            Promise.reject({
              apiError: { errors: [{ detail: ERROR_PERSON_PART_OF_ORG }] },
            })
        : apiResponse,
    );
    await store.dispatch(joinCommunity(orgId, code));

    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.JOIN_COMMUNITY_WITH_CODE,
    );
    expect(apolloClient.query).toHaveBeenCalledWith({
      query: GET_COMMUNITIES_QUERY,
      fetchPolicy: 'cache-and-network',
    });
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_ORGANIZATIONS, query);
    expect(store.getActions()).toEqual([
      trackActionResponse,
      apiResponse,
      {
        type: LOAD_ORGANIZATIONS,
        orgs: [],
      },
    ]);
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

describe('navigateToCommunity', () => {
  const orgId = '123456';

  beforeEach(() => {
    navigatePush.mockReturnValue({ type: 'test' });
  });

  describe('default', () => {
    beforeEach(() => {
      store.dispatch(navigateToCommunity());
    });

    it('navigates to GLOBAL_GROUPS_SCREEN', () => {
      expect(navigateReset).toBeCalledWith(GLOBAL_GROUP_SCREEN, {
        orgId: GLOBAL_COMMUNITY_ID,
        initialTab: undefined,
      });
    });
  });

  describe('Cru org', () => {
    it('navigates to GROUPS_SCREEN', () => {
      store.dispatch(navigateToCommunity({ id: orgId, userCreated: false }));

      expect(navigatePush).toBeCalledWith(GROUP_SCREEN, {
        orgId,
        initialTab: undefined,
      });
    });

    it('navigates to GROUPS_SCREEN', () => {
      store.dispatch(navigateToCommunity({ id: orgId, user_created: false }));

      expect(navigatePush).toBeCalledWith(GROUP_SCREEN, {
        orgId,
        initialTab: undefined,
      });
    });
  });

  describe('user-created org', () => {
    it('navigates to USER_CREATED_GROUPS_SCREEN', () => {
      store.dispatch(navigateToCommunity({ id: orgId, userCreated: true }));

      expect(navigatePush).toBeCalledWith(USER_CREATED_GROUP_SCREEN, {
        orgId,
        initialTab: undefined,
      });
    });

    it('navigates to USER_CREATED_GROUPS_SCREEN', () => {
      store.dispatch(navigateToCommunity({ id: orgId, user_created: true }));

      expect(navigatePush).toBeCalledWith(USER_CREATED_GROUP_SCREEN, {
        orgId,
        initialTab: undefined,
      });
    });
  });

  describe('global org', () => {
    it('navigates to GLOBAL_GROUPS_SCREEN', () => {
      store.dispatch(navigateToCommunity({ id: GLOBAL_COMMUNITY_ID }));

      expect(navigatePush).toBeCalledWith(GLOBAL_GROUP_SCREEN, {
        orgId: GLOBAL_COMMUNITY_ID,
        initialTab: undefined,
      });
    });
  });

  describe('intial tab', () => {
    it('navigates to USER_CREATED_GROUPS_SCREEN with initial tab', () => {
      store.dispatch(
        navigateToCommunity({ id: orgId, userCreated: true }, GROUP_CHALLENGES),
      );

      expect(navigatePush).toBeCalledWith(USER_CREATED_GROUP_SCREEN, {
        orgId,
        initialTab: GROUP_CHALLENGES,
      });
    });
  });
});

describe('navigateToCelebrateComments', () => {
  const cruOrgId = '123456';
  const cruOrg = { id: cruOrgId, user_created: false };
  const userCreatedOrgId = '654321';
  const userCreatedOrg = { id: userCreatedOrgId, user_created: true };
  const celebrateItemId = '111';

  beforeEach(() => {
    store = mockStore({
      organizations: {
        all: [globalCommunity, cruOrg, userCreatedOrg],
      },
    });
    navigateNestedReset.mockReturnValue({ type: 'test' });
  });

  describe('Cru org', () => {
    beforeEach(() => {
      store.dispatch(navigateToCelebrateComments(cruOrgId, celebrateItemId));
    });

    it('navigates to CELEBRATE_DETAIL_SCREEN', () => {
      expect(navigateNestedReset).toBeCalledWith([
        {
          routeName: GROUP_SCREEN,
          params: { orgId: cruOrgId },
        },
        {
          routeName: GROUP_UNREAD_FEED_SCREEN,
          params: { organization: cruOrg },
        },
        {
          routeName: CELEBRATE_DETAIL_SCREEN,
          params: {
            event: { id: celebrateItemId, organization: cruOrg },
          },
        },
      ]);
    });
  });

  describe('user-created org', () => {
    beforeEach(() => {
      store.dispatch(
        navigateToCelebrateComments(userCreatedOrgId, celebrateItemId),
      );
    });

    it('navigates to CELEBRATE_DETAIL_SCREEN', () => {
      expect(navigateNestedReset).toBeCalledWith([
        {
          routeName: USER_CREATED_GROUP_SCREEN,
          params: { orgId: userCreatedOrgId },
        },
        {
          routeName: GROUP_UNREAD_FEED_SCREEN,
          params: { organization: userCreatedOrg },
        },
        {
          routeName: CELEBRATE_DETAIL_SCREEN,
          params: {
            event: { id: celebrateItemId, organization: userCreatedOrg },
          },
        },
      ]);
    });
  });
});
