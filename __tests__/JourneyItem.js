import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import JourneyItem from '../src/components/JourneyItem';
import { testSnapshot } from '../testUtils';

const date = '2017-12-06T14:24:52Z';
const mockStep = {
  id: '123',
  text: 'Test Journey',
  completed_at: date,
  created_at: date,
  interaction_type_id: 1,
  date,
};
const challenge_suggestion = {
  pathway_stage: {
    name: 'Guiding',
  },
};

describe('step', () => {
  it('is rendered correctly without comment', () => {
    testSnapshot(
      <JourneyItem item={mockStep} type="step" />
    );
  });

  it('is rendered correctly with comment', () => {
    testSnapshot(
      <JourneyItem item={{ ...mockStep, note: 'test comment on completed step' }} type="step" />
    );
  });

  it('is rendered correctly with pathway stage', () => {
    testSnapshot(
      <JourneyItem item={{ ...mockStep, challenge_suggestion }} type="step" />
    );
  });
});

describe('stage', () => {
  const mockStage = {
    ...mockStep,
    personName: 'Test Person',
    new_pathway_stage: { id: '2', _type: 'pathway_stage', name: 'Curious' },
  };

  it('is rendered correctly with old stage', () => {
    testSnapshot(
      <JourneyItem item={{ ...mockStage, old_pathway_stage: { id: '1', _type: 'pathway_stage', name: 'Uninterested' } }} type="stage" />
    );
  });

  it('is rendered correctly without old stage', () => {
    testSnapshot(
      <JourneyItem item={{ ...mockStage, old_pathway_stage: { name: '' } }} type="stage" />

    );
  });
});

it('renders survey correctly', () => {
  testSnapshot(
    <JourneyItem item={{
      ...mockStep,
      survey: { title: 'Survey Test' },
      answers: [
        { id: '1', question: { label: 'Question 1' }, value: 'Answer 1' },
        { id: '2', question: { label: 'Question 2' }, value: 'Answer 2' },
        { id: '3', question: { label: 'Question 3' }, value: 'Answer 3' },
      ],
    }} type="survey" />
  );
});

it('renders interaction correctly', () => {
  testSnapshot(
    <JourneyItem item={mockStep} type="interaction" />
  );
});
