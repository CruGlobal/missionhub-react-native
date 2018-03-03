import { getJourney } from '../../src/actions/journey';
import { getStages } from '../../src/actions/stages';
import { getStepsByFilter } from '../../src/actions/steps';
import { getPersonJourneyDetails } from '../../src/actions/person';
jest.mock('../../src/actions/stages');
jest.mock('../../src/actions/steps');
jest.mock('../../src/actions/person');

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockStore = configureStore([ thunk ]);

const personId = '2';
const myId = '1';
const orgId = '1';

const stages = [
  { id: '1', _type: 'pathway_stage', name: 'Uninterested' },
  { id: '2', _type: 'pathway_stage', name: 'Curious' },
];
const steps = [
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
];
const person = {
  id: personId,
  first_name: 'Person with history',
  interactions: [
    {
      id: '1',
      _type: 'interaction',
      comment: 'Interaction in org',
      initiators: [
        { id: '3' },
        { id: myId },
      ],
      organization: { id: orgId },
      created_at: '2018-02-01T00:00:00',
    },
    {
      id: '2',
      _type: 'interaction',
      comment: 'Interaction in another org',
      initiators: [
        { id: myId },
      ],
      organization: { id: '2' },
      created_at: '2018-02-02T00:00:00',
    },
    {
      id: '3',
      _type: 'interaction',
      comment: 'Interaction by someone else',
      initiators: [
        { id: '3' },
      ],
      organization: { id: orgId },
      created_at: '2018-02-03T00:00:00',
    },
    {
      id: '4',
      _type: 'interaction',
      comment: 'Comment in personal org',
      initiators: [
        { id: myId },
      ],
      organization: null,
      created_at: '2018-02-12T00:00:00',
    },
  ],
  pathway_progression_audits: [
    {
      id: '1',
      _type: 'pathway_progression_audit',
      comment: 'Stage change in org',
      assigned_to: { id: myId },
      organization: { id: orgId },
      old_pathway_stage: { id: '1' },
      new_pathway_stage: { id: '2' },
      created_at: '2018-02-04T00:00:00',
    },
    {
      id: '2',
      _type: 'pathway_progression_audit',
      comment: 'Stage change in another org',
      assigned_to: { id: myId },
      organization: { id: '2' },
      old_pathway_stage: { id: '1' },
      new_pathway_stage: { id: '2' },
      created_at: '2018-02-05T00:00:00',
    },
    {
      id: '3',
      _type: 'pathway_progression_audit',
      comment: 'Stage change by someone else',
      assigned_to: { id: '3' },
      organization: { id: orgId },
      old_pathway_stage: { id: '1' },
      new_pathway_stage: { id: '2' },
      created_at: '2018-02-06T00:00:00',
    },
    {
      id: '4',
      _type: 'pathway_progression_audit',
      comment: 'Stage change in personal org',
      assigned_to: { id: myId },
      organization: null,
      old_pathway_stage: { id: '1' },
      new_pathway_stage: { id: '2' },
      created_at: '2018-02-11T00:00:00',
    },
  ],
  answer_sheets: [
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
  ],
};


getStages.mockReturnValue(() => Promise.resolve({ response: stages }));
getStepsByFilter.mockReturnValue(() => Promise.resolve({ response: steps }));
getPersonJourneyDetails.mockReturnValue(() => Promise.resolve({ response: person }));

describe('get journey', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: { personId: myId },
      stages: {
        stagesObj: {
          '1': stages[ 0 ],
          '2': stages[ 1 ],
        },
      },
    });
  });

  xit('should fetch stages if they are not loaded', async() => {
    store = mockStore({
      auth: { personId: myId },
      stages: {},
    });
    await store.dispatch(getJourney(personId));
    expect(getStages).toHaveBeenCalled();
  });

  it('should get a person\'s journey without an org (personal ministry)', async() => {
    expect(await store.dispatch(getJourney(personId))).toMatchSnapshot();
    expect(getStages).not.toHaveBeenCalled();
    expect(getStepsByFilter).toHaveBeenCalledWith({
      completed: true,
      receiver_ids: personId,
      organization_ids: undefined,
    });
    expect(getPersonJourneyDetails).toHaveBeenCalledWith(personId, {
      include: 'pathway_progression_audits,interactions.comment,answer_sheets.answers,answer_sheets.survey.active_survey_elements.question',
    });
  });

  it('should get a person\'s journey with an org', async() => {
    getStepsByFilter.mockReturnValue(() => Promise.resolve({ response: [ steps[0] ] }));

    expect(await store.dispatch(getJourney(personId, orgId))).toMatchSnapshot();
    expect(getStages).not.toHaveBeenCalled();
    expect(getStepsByFilter).toHaveBeenCalledWith({
      completed: true,
      receiver_ids: personId,
      organization_ids: orgId,
    });
    expect(getPersonJourneyDetails).toHaveBeenCalledWith(personId, {
      include: 'pathway_progression_audits,interactions.comment,answer_sheets.answers,answer_sheets.survey.active_survey_elements.question',
    });
  });
});
