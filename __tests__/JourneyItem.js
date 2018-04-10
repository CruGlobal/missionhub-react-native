import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import JourneyItem from '../src/components/JourneyItem';
import { testSnapshotShallow } from '../testUtils';

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
    testSnapshotShallow(
      <JourneyItem item={mockStep} type="step" />
    );
  });

  it('is rendered correctly with comment', () => {
    testSnapshotShallow(
      <JourneyItem item={{ ...mockStep, note: 'test comment on completed step' }} type="step" />
    );
  });

  it('is rendered correctly with pathway stage', () => {
    testSnapshotShallow(
      <JourneyItem item={{ ...mockStep, challenge_suggestion }} type="step" />
    );
  });
});

describe('stage', () => {
  const stagePersonId = 889433;
  const mockStage = {
    ...mockStep,
    personName: 'Test Person',
    new_pathway_stage: {
      id: '2',
      _type: 'pathway_stage',
      name: 'Curious',
    },
    person: { id: stagePersonId },
  };

  it('is rendered correctly with old stage for a contact', () => {
    testSnapshotShallow(
      <JourneyItem
        item={{
          ...mockStage,
          old_pathway_stage: { id: '1', _type: 'pathway_stage', name: 'Uninterested' },
        }}
        myId={484893}
        type="stage" />
    );
  });

  it('is rendered correctly with old stage for self', () => {
    testSnapshotShallow(
      <JourneyItem
        item={{
          ...mockStage,
          old_pathway_stage: { id: '1', _type: 'pathway_stage', name: 'Uninterested' },
        }}
        myId={stagePersonId}
        type="stage" />
    );
  });

  it('is rendered correctly without old stage for a contact', () => {
    testSnapshotShallow(
      <JourneyItem
        item={{
          ...mockStage,
          old_pathway_stage: { name: '' },
        }}
        myId={484893}
        type="stage" />

    );
  });

  it('is rendered correctly without old stage for self', () => {
    testSnapshotShallow(
      <JourneyItem
        item={{
          ...mockStage,
          old_pathway_stage: { name: '' },
        }}
        myId={stagePersonId}
        type="stage" />

    );
  });
});

it('renders survey correctly', () => {
  testSnapshotShallow(
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
  testSnapshotShallow(
    <JourneyItem item={mockStep} type="interaction" />
  );
});
