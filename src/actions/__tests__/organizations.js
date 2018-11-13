import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockDate from 'mockdate';

import {
  GET_ORGANIZATIONS_CONTACTS_REPORT,
  GET_ORGANIZATION_MEMBERS,
  GET_ORGANIZATION_PEOPLE,
  LOAD_ORGANIZATIONS,
  DEFAULT_PAGE_LIMIT,
} from '../../constants';
import callApi, { REQUESTS } from '../api';
import {
  getMyOrganizations,
  getOrganizationsContactReports,
  getOrganizationContacts,
  getOrganizationMembers,
  getOrganizationMembersNextPage,
  addNewPerson,
  getMyCommunities,
  addNewOrganization,
  updateOrganization,
  updateOrganizationImage,
  deleteOrganization,
} from '../organizations';

jest.mock('../../selectors/organizations');
jest.mock('../api');

global.FormData = require('FormData');

const myId = '1';

const mockStore = configureStore([thunk]);
let store;
const auth = { person: { user: {}, id: myId } };

beforeEach(() => {
  store = mockStore({ auth });
  callApi.mockClear();
});

describe('getMyOrganizations', () => {
  const query = {
    limit: 100,
    include: '',
    filters: {
      descendants: false,
    },
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

  it('should get contact reports and dispatch to API', async () => {
    callApi.mockReturnValue(contactReportsResponse);

    await store.dispatch(getOrganizationsContactReports());

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.GET_ORGANIZATION_INTERACTIONS_REPORT,
      { period: 'P1W' },
    );
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
    include: 'organizational_permissions',
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
  it('should get my communities', async () => {
    const response = {
      type: 'successful',
      response: [{}],
    };
    callApi.mockReturnValue(response);
    await store.dispatch(getMyCommunities());
    const actions = store.getActions();

    // Api call, then LOAD_ORGANIZATIONS
    expect(actions[0]).toEqual(response);
    expect(actions[1].type).toEqual(LOAD_ORGANIZATIONS);
    // Another api call, then GET_ORGANIZATIONS_CONTACTS_REPORT
    expect(actions[2]).toEqual(response);
    expect(actions[3].type).toEqual(GET_ORGANIZATIONS_CONTACTS_REPORT);
  });
});

describe('addNewOrganization', () => {
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
  const apiResponse = { type: 'api response' };

  beforeEach(() => {
    callApi.mockReturnValue(() => Promise.resolve(apiResponse));
  });

  it('adds organization with name', () => {
    store.dispatch(addNewOrganization(name));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.ADD_NEW_ORGANIZATION,
      {},
      bodyData,
    );
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

  beforeEach(() => {
    callApi.mockReturnValue(apiResponse);
  });

  it('delete organization', () => {
    store.dispatch(deleteOrganization(orgId));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.DELETE_ORGANIZATION, {
      orgId,
    });
  });
});
