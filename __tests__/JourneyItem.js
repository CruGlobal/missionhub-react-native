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

it('renders step correctly', () => {
  testSnapshot(
    <JourneyItem item={mockStep} type="step" />
  );
});

it('renders stage correctly', () => {
  testSnapshot(
    <JourneyItem item={{
      ...mockStep,
      personName: 'Test Person',
      old_pathway_stage: { id: '1', _type: 'pathway_stage', name: 'Uninterested' },
      new_pathway_stage: { id: '2', _type: 'pathway_stage', name: 'Curious' },
    }} type="stage" />
  );
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
