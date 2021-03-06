import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockDate from 'mockdate';

import callApi from '../api';
import { REQUESTS } from '../../api/routes';
import { getJourney, reloadJourney } from '../journey';
import { ACCEPTED_STEP } from '../../constants';

jest.mock('../api');
jest.mock('../../utils/common');

MockDate.set('2018-04-17');

const mockStore = configureStore([thunk]);

const personId = '2';
const myId = '1';
let store = mockStore();

const feed = [
  {
    id: '1',
    _type: ACCEPTED_STEP,
    title: 'Step in org',
    completed_at: '2018-02-09T00:00:00',
  },
  {
    id: '2',
    _type: ACCEPTED_STEP,
    title: 'Step in personal org',
    completed_at: '2018-02-10T00:00:00',
  },
  {
    id: '1',
    _type: 'interaction',
    comment: 'Interaction in org',
    initiators: [{ id: '3' }, { id: myId }],
    created_at: '2018-02-01T00:00:00',
  },
  {
    id: '2',
    _type: 'interaction',
    comment: 'Interaction in another org',
    initiators: [{ id: myId }],
    created_at: '2018-02-02T00:00:00',
  },
  {
    id: '3',
    _type: 'interaction',
    comment: 'Interaction by someone else',
    initiators: [{ id: '3' }],
    created_at: '2018-02-03T00:00:00',
  },
  {
    id: '4',
    _type: 'interaction',
    comment: 'Comment in personal org',
    initiators: [{ id: myId }],
    created_at: '2018-02-12T00:00:00',
  },
  {
    id: '1',
    _type: 'pathway_progression_audit',
    comment: 'Stage change in org',
    assigned_to: { id: myId },
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
    },
    created_at: '2018-02-07T00:00:00',
  },
  {
    id: '2',
    _type: 'answer_sheet',
    survey: {
      title: 'Survey in another org',
    },
    created_at: '2018-02-08T00:00:00',
  },
];

(callApi as jest.Mock).mockReturnValue(() =>
  Promise.resolve({ response: { all: feed } }),
);

describe('reload journey', () => {
  it('should not load if journey has not been fetched for org', async () => {
    store = mockStore({ journey: { personal: {} } });

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    await store.dispatch<any>(reloadJourney(personId));

    expect(store.getActions()).toEqual([]);
  });

  it('should not load if journey has not been fetched for person', async () => {
    store = mockStore({ journey: { personal: {} } });

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    await store.dispatch<any>(reloadJourney(personId));

    expect(store.getActions()).toEqual([]);
  });

  it('should reload if journey has been fetched for person', async () => {
    store = mockStore({ journey: { personal: { [personId]: [] } } });

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    await store.dispatch<any>(reloadJourney(personId));

    expect(store.getActions().length).toEqual(1);
  });
});

describe('get journey', () => {
  it("should get a person's journey without an org (personal ministry)", async () => {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(await store.dispatch<any>(getJourney(personId))).toMatchSnapshot();
    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_PERSON_FEED, {
      include:
        'all.challenge_suggestion.pathway_stage.localized_pathway_stages,all.old_pathway_stage.localized_pathway_stages,all.new_pathway_stage.localized_pathway_stages,all.answers.question,all.survey,all.person,all.assigned_to,all.assigned_by',
      filters: {
        person_id: personId,
        organization_ids: 'null',
        starting_at: '2011-01-01T00:00:00Z',
        ending_at: '2018-04-17T00:00:00.000Z',
      },
    });
  });
});
