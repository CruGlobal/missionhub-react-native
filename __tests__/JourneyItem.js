import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import JourneyItem from '../src/components/JourneyItem';
import { testSnapshot } from '../testUtils';

const date = '2017-12-06T14:24:52Z';
let mockStep;

beforeEach(() => {
  mockStep = {
    id: '123',
    text: 'Test Journey',
    completed_at: date,
    created_at: date,
    interaction_type_id: 1,
    date,
    new_stage: 'Guiding',
  };
});

it('renders step correctly', () => {
  testSnapshot(
    <JourneyItem item={mockStep} type="step" />
  );
});

describe('stage', () => {
  it('is rendered correctly with old stage', () => {
    mockStep.old_stage = 'Growing';

    testSnapshot(
      <JourneyItem item={mockStep} type="stage" />
    );
  });

  it('is rendered correctly without old stage', () => {
    testSnapshot(
      <JourneyItem item={mockStep} type="stage" />
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
