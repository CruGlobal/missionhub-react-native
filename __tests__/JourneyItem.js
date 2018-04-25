import 'react-native';
import React from 'react';

import JourneyItem from '../src/components/JourneyItem';
import { testSnapshotShallow } from '../testUtils';

const myId = '484893';
const person = {
  id: '889433',
  _type: 'person',
  first_name: 'Test Person',
};
const date = '2017-12-06T14:24:52Z';

describe('step', () => {
  const mockStep = {
    id: '1',
    _type: 'accepted_challenge',
    title: 'Test Step',
    completed_at: date,
  };
  const challenge_suggestion = {
    pathway_stage: {
      name: 'Guiding',
    },
  };

  it('is rendered correctly without comment', () => {
    testSnapshotShallow(
      <JourneyItem
        item={mockStep}
        myId={myId} />
    );
  });

  it('is rendered correctly with comment', () => {
    testSnapshotShallow(
      <JourneyItem
        item={{ ...mockStep, note: 'test comment on completed step' }}
        myId={myId} />
    );
  });

  it('is rendered correctly with pathway stage', () => {
    testSnapshotShallow(
      <JourneyItem
        item={{ ...mockStep, challenge_suggestion }}
        myId={myId} />
    );
  });
});

describe('stage', () => {
  const mockStageProgression = {
    id: '3',
    _type: 'pathway_progression_audit',
    comment: 'Test Stage Change',
    old_pathway_stage: { id: '1', _type: 'pathway_stage', name: 'Uninterested' },
    new_pathway_stage: { id: '2', _type: 'pathway_stage', name: 'Curious' },
    created_at: date,
    person,
  };

  it('is rendered correctly with old stage for a contact', () => {
    testSnapshotShallow(
      <JourneyItem
        item={mockStageProgression}
        myId={myId} />
    );
  });

  it('is rendered correctly with old stage for self', () => {
    testSnapshotShallow(
      <JourneyItem
        item={mockStageProgression}
        myId={person.id} />
    );
  });

  it('is rendered correctly without old stage for a contact', () => {
    testSnapshotShallow(
      <JourneyItem
        item={{
          ...mockStageProgression,
          old_pathway_stage: {},
        }}
        myId={myId} />

    );
  });

  it('is rendered correctly without old stage for self', () => {
    testSnapshotShallow(
      <JourneyItem
        item={{
          ...mockStageProgression,
          old_pathway_stage: {},
        }}
        myId={person.id} />

    );
  });
});

it('renders survey correctly', () => {
  testSnapshotShallow(
    <JourneyItem
      item={{
        id: '5',
        _type: 'answer_sheet',
        survey: { title: 'Test Survey' },
        answers: [
          { id: '1', question: { label: 'Question 1' }, value: 'Answer 1' },
          { id: '2', question: { label: 'Question 2' }, value: 'Answer 2' },
          { id: '3', question: { label: 'Question 3' }, value: 'Answer 3' },
        ],
        created_at: date,
      }}
      myId={myId} />
  );
});

it('renders interaction correctly', () => {
  testSnapshotShallow(
    <JourneyItem
      item={{
        id: '4',
        _type: 'interaction',
        interaction_type_id: 1,
        comment: 'Test Interaction',
        initiators: [
          { id: myId },
        ],
        organization: null,
        created_at: date,
      }}
      myId={myId} />
  );
});
