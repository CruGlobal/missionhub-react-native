import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockDate from 'mockdate';

import callApi, { REQUESTS } from '../../src/actions/api';
import {
  getJourney,
  reloadJourney,
  getGroupJourney,
} from '../../src/actions/journey';

jest.mock('../../src/actions/api');

const mockStore = configureStore([thunk]);

const personId = '2';
const myId = '1';
const orgId = '1';
let store = mockStore();

const feed = [
  {
    id: '1',
    _type: 'accepted_challenge',
    title: 'Step in org',
    organization: { id: orgId },
    completed_at: '2018-02-09T00:00:00',
  },
  {
    id: '2',
    _type: 'accepted_challenge',
    title: 'Step in personal org',
    organization: null,
    completed_at: '2018-02-10T00:00:00',
  },
  {
    id: '1',
    _type: 'interaction',
    comment: 'Interaction in org',
    initiators: [{ id: '3' }, { id: myId }],
    organization: { id: orgId },
    created_at: '2018-02-01T00:00:00',
  },
  {
    id: '2',
    _type: 'interaction',
    comment: 'Interaction in another org',
    initiators: [{ id: myId }],
    organization: { id: '2' },
    created_at: '2018-02-02T00:00:00',
  },
  {
    id: '3',
    _type: 'interaction',
    comment: 'Interaction by someone else',
    initiators: [{ id: '3' }],
    organization: { id: orgId },
    created_at: '2018-02-03T00:00:00',
  },
  {
    id: '4',
    _type: 'interaction',
    comment: 'Comment in personal org',
    initiators: [{ id: myId }],
    organization: null,
    created_at: '2018-02-12T00:00:00',
  },
  {
    id: '1',
    _type: 'pathway_progression_audit',
    comment: 'Stage change in org',
    assigned_to: { id: myId },
    organization: { id: orgId },
    old_pathway_stage: {
      id: '1',
      _type: 'pathway_stage',
      name: 'Uninterested',
    },
    new_pathway_stage: { id: '2', _type: 'pathway_stage', name: 'Curious' },
    created_at: '2018-02-04T00:00:00',
    person: { id: personId },
  },
  {
    id: '2',
    _type: 'pathway_progression_audit',
    comment: 'Stage change in another org',
    assigned_to: { id: myId },
    organization: { id: '2' },
    old_pathway_stage: {
      id: '1',
      _type: 'pathway_stage',
      name: 'Uninterested',
    },
    new_pathway_stage: { id: '2', _type: 'pathway_stage', name: 'Curious' },
    created_at: '2018-02-05T00:00:00',
    person: { id: personId },
  },
  {
    id: '3',
    _type: 'pathway_progression_audit',
    comment: 'Stage change by someone else',
    assigned_to: { id: '3' },
    organization: { id: orgId },
    old_pathway_stage: {
      id: '1',
      _type: 'pathway_stage',
      name: 'Uninterested',
    },
    new_pathway_stage: { id: '2', _type: 'pathway_stage', name: 'Curious' },
    created_at: '2018-02-06T00:00:00',
    person: { id: personId },
  },
  {
    id: '4',
    _type: 'pathway_progression_audit',
    comment: 'Stage change in personal org',
    assigned_to: { id: myId },
    organization: null,
    old_pathway_stage: {
      id: '1',
      _type: 'pathway_stage',
      name: 'Uninterested',
    },
    new_pathway_stage: { id: '2', _type: 'pathway_stage', name: 'Curious' },
    created_at: '2018-02-11T00:00:00',
    person: { id: personId },
  },
  {
    id: '1',
    _type: 'answer_sheet',
    survey: {
      title: 'Survey in org',
      organization_id: orgId,
    },
    created_at: '2018-02-07T00:00:00',
  },
  {
    id: '2',
    _type: 'answer_sheet',
    survey: {
      title: 'Survey in another org',
      organization_id: '2',
    },
    created_at: '2018-02-08T00:00:00',
  },
];

callApi.mockReturnValue(() => Promise.resolve({ response: { all: feed } }));

describe('reload journey', () => {
  it('should not load if journey has not been fetched for org', async () => {
    store = mockStore({ journey: { personal: {} } });

    await store.dispatch(reloadJourney(personId, orgId));

    expect(store.getActions()).toEqual([]);
  });

  it('should not load if journey has not been fetched for person', async () => {
    store = mockStore({ journey: { personal: {}, [orgId]: {} } });

    await store.dispatch(reloadJourney(personId, orgId));

    expect(store.getActions()).toEqual([]);
  });

  it('should reload if journey has been fetched for person', async () => {
    store = mockStore({ journey: { personal: { [personId]: [] } } });

    await store.dispatch(reloadJourney(personId));

    expect(store.getActions().length).toEqual(1);
  });
});

describe('get journey', () => {
  beforeEach(() => {
    MockDate.set('2018-04-17');
  });

  afterEach(() => {
    MockDate.reset();
  });

  async function test(orgId, expectedOrgId) {
    expect(await store.dispatch(getJourney(personId, orgId))).toMatchSnapshot();
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_PERSON_FEED, {
      include:
        'all.answers.question,all.survey,all.person,all.old_pathway_stage,all.new_pathway_stage',
      filters: {
        person_id: personId,
        organization_ids: expectedOrgId,
        starting_at: '2011-01-01T00:00:00Z',
        ending_at: '2018-04-17T00:00:00Z',
      },
    });
  }

  it("should get a person's journey without an org (personal ministry)", async () => {
    test(undefined, 'null');
  });

  it("should get a person's journey with an org", async () => {
    test(orgId, orgId);
  });
});

describe('get group journey', () => {
  beforeEach(() => {
    MockDate.set('2018-04-17');
  });

  afterEach(() => {
    MockDate.reset();
  });

  it('should get a persons group journey', async () => {
    store = mockStore({
      auth: {
        person: {
          organizational_permissions: [
            { organization_id: orgId, permission_id: 1 },
          ],
        },
      },
    });
    expect(
      await store.dispatch(getGroupJourney(personId, orgId)),
    ).toMatchSnapshot();
  });
});
