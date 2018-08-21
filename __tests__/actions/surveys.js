import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import callApi, { REQUESTS } from '../../src/actions/api';
import {
  getMySurveys,
  getOrgSurveys,
  getOrgSurveysNextPage,
  searchSurveyContacts,
  getSurveyQuestions,
} from '../../src/actions/surveys';
import {
  GET_ORGANIZATION_SURVEYS,
  DEFAULT_PAGE_LIMIT,
} from '../../src/constants';

const apiResponse = { type: 'successful' };

jest.mock('../../src/actions/api');

let store;

beforeEach(() => {
  store = configureStore([thunk])();
  callApi.mockClear();
});

describe('getMySurveys', () => {
  const query = {
    limit: 100,
    include: '',
  };

  it('should get my surveys', () => {
    callApi.mockReturnValue(apiResponse);

    store.dispatch(getMySurveys());

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_SURVEYS, query);
    expect(store.getActions()).toEqual([apiResponse]);
  });
});

describe('getOrgSurveys', () => {
  const orgId = '123';
  const query = {
    filters: {
      organization_ids: orgId,
    },
  };
  const surveys = [
    {
      name: 'person',
      id: '1',
    },
    {
      name: 'person',
      id: '2',
    },
  ];
  const surveysResponse = {
    type: 'successful',
    response: surveys,
    meta: { total: 50 },
  };
  const getSurveysAction = {
    type: GET_ORGANIZATION_SURVEYS,
    orgId,
    surveys,
    query,
    meta: { total: 50 },
  };

  it('should get surveys in organization', async () => {
    callApi.mockReturnValue(surveysResponse);

    await store.dispatch(getOrgSurveys(orgId));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_GROUP_SURVEYS, query);
    expect(store.getActions()).toEqual([surveysResponse, getSurveysAction]);
  });
});

describe('getOrgSurveysNextPage', () => {
  const orgId = '123';
  const query = {
    page: {
      limit: 25,
      offset: 25,
    },
    filters: {
      organization_ids: orgId,
    },
  };
  const surveys = [
    {
      id: '1',
      title: 'person',
      contacts_count: 5,
      unassigned_contacts_count: 5,
      uncontacted_contacts_count: 5,
    },
    {
      id: '2',
      title: 'person',
      contacts_count: 5,
      unassigned_contacts_count: 5,
      uncontacted_contacts_count: 5,
    },
  ];
  const surveysResponse = {
    type: 'successful',
    response: surveys,
    meta: { total: 50 },
  };
  const getSurveysAction = {
    type: GET_ORGANIZATION_SURVEYS,
    orgId,
    surveys,
    query,
    meta: { total: 50 },
  };

  it('should get surveys next page in organization', async () => {
    store = configureStore([thunk])({
      organizations: { surveysPagination: { hasNextPage: true, page: 1 } },
    });
    callApi.mockReturnValue(surveysResponse);

    await store.dispatch(getOrgSurveysNextPage(orgId));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_GROUP_SURVEYS, query);
    expect(store.getActions()).toEqual([surveysResponse, getSurveysAction]);
  });

  it('should not get next page', async () => {
    store = configureStore([thunk])({
      organizations: { surveysPagination: { hasNextPage: false, page: 1 } },
    });
    callApi.mockReturnValue(surveysResponse);

    const result = await store.dispatch(getOrgSurveysNextPage(orgId));

    expect(result).toEqual(undefined);
  });
});

describe('searchSurveyContacts', () => {
  const name = 'name';
  const question1 = { id: '123', text: '123Text', isAnswer: true };
  const question2 = { id: '456', text: '456Text', isAnswer: true };
  const filters = {
    survey: { id: '12345' },
    organization: { id: '45678' },
    [question1.id]: question1,
    [question2.id]: question2,
    gender: { id: 'Female' },
    uncontacted: true,
    unassigned: true,
    archived: true,
    labels: { id: '333' },
    groups: { id: '444' },
  };
  const query = {
    filters: {
      survey_ids: filters.survey.id,
      people: {
        name: name,
        organization_ids: filters.organization.id,
        genders: filters.gender.id,
        statuses: 'uncontacted',
        assigned_tos: 'unassigned',
        include_archived: true,
        label_ids: filters.labels.id,
        group_ids: filters.groups.id,
      },
      answers: {
        [question1.id]: { '': question1.text },
        [question2.id]: { '': question2.text },
      },
    },
    page: {
      limit: DEFAULT_PAGE_LIMIT,
      offset: 0,
    },
    include: 'person.reverse_contact_assignments',
  };

  it('calls API for filtered answer sheets', async () => {
    store = configureStore([thunk])();
    callApi.mockReturnValue(apiResponse);

    const pagination = {
      page: 0,
      hasMore: true,
    };

    await store.dispatch(searchSurveyContacts(name, pagination, filters));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_ANSWER_SHEETS, query);
    expect(store.getActions()).toEqual([apiResponse]);
  });

  it('should reject because no survey was passed in', async () => {
    store = configureStore([thunk])();
    callApi.mockReturnValue(apiResponse);
    try {
      await store.dispatch(searchSurveyContacts(name, {}));
    } catch (e) {
      expect(e).toBe('No Survey Specified in searchSurveyContacts');
    }
  });
});

describe('getSurveyQuestions', () => {
  const surveyId = '12345';

  it('gets survey questions', async () => {
    callApi.mockReturnValue(apiResponse);

    await store.dispatch(getSurveyQuestions(surveyId));

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_SURVEY_QUESTIONS, {
      surveyId,
    });
    expect(store.getActions()).toEqual([apiResponse]);
  });
});
