import 'react-native';
import React from 'react';

import { getAssignedByName, getAssignedToName } from '../../../utils/common';

import JourneyItem from '..';

import { testSnapshotShallow, renderShallow } from '../../../../testUtils';

jest.mock('../../../utils/common');

const myId = '484893';
const person = {
  id: '889433',
  _type: 'person',
  first_name: 'Test Person',
};
const date = '2017-12-06T14:24:52Z';

beforeEach(() => {
  getAssignedToName.mockReset();
  getAssignedByName.mockReset();

  getAssignedToName.mockReturnValue('Roger');
  getAssignedByName.mockReturnValue('Billy');
});

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
        myId={myId}
        personFirstName={person.first_name}
      />,
    );
  });

  it('is rendered correctly with comment', () => {
    testSnapshotShallow(
      <JourneyItem
        item={{ ...mockStep, note: 'test comment on completed step' }}
        myId={myId}
        personFirstName={person.first_name}
      />,
    );
  });

  it('is rendered correctly with pathway stage', () => {
    testSnapshotShallow(
      <JourneyItem
        item={{ ...mockStep, challenge_suggestion }}
        myId={myId}
        personFirstName={person.first_name}
      />,
    );
  });
});

describe('stage', () => {
  const mockStageProgression = {
    id: '3',
    _type: 'pathway_progression_audit',
    comment: 'Test Stage Change',
    old_pathway_stage: {
      id: '1',
      _type: 'pathway_stage',
      name: 'Uninterested',
    },
    new_pathway_stage: { id: '2', _type: 'pathway_stage', name: 'Curious' },
    created_at: date,
    person,
  };

  it('is rendered correctly with old stage for a contact', () => {
    testSnapshotShallow(
      <JourneyItem
        item={mockStageProgression}
        myId={myId}
        personFirstName={person.first_name}
      />,
    );
  });

  it('is rendered correctly with old stage for self', () => {
    testSnapshotShallow(
      <JourneyItem
        item={mockStageProgression}
        myId={person.id}
        personFirstName={person.first_name}
      />,
    );
  });

  it('is rendered correctly without old stage for a contact', () => {
    testSnapshotShallow(
      <JourneyItem
        item={{
          ...mockStageProgression,
          old_pathway_stage: {},
        }}
        myId={myId}
        personFirstName={person.first_name}
      />,
    );
  });

  it('is rendered correctly without old stage for self', () => {
    testSnapshotShallow(
      <JourneyItem
        item={{
          ...mockStageProgression,
          old_pathway_stage: {},
        }}
        myId={person.id}
        personFirstName={person.first_name}
      />,
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
      myId={myId}
      personFirstName={person.first_name}
    />,
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
        initiators: [{ id: myId }],
        organization: null,
        created_at: date,
      }}
      myId={myId}
      personFirstName={person.first_name}
    />,
  );
});

it('renders contact_assignment correctly', () => {
  const item = {
    id: '5',
    _type: 'contact_assignment',
    created_at: date,
  };

  testSnapshotShallow(
    <JourneyItem item={item} myId={myId} personFirstName={person.first_name} />,
  );

  expect(getAssignedToName).toHaveBeenCalledWith(myId, item);
  expect(getAssignedByName).toHaveBeenCalledWith(myId, item);
});

it('renders contact_unassignment correctly', () => {
  const item = {
    id: '6',
    _type: 'contact_unassignment',
    created_at: date,
  };

  testSnapshotShallow(
    <JourneyItem item={item} myId={myId} personFirstName={person.first_name} />,
  );

  expect(getAssignedToName).toHaveBeenCalledWith(myId, item);
});

it('should call ref', () => {
  const item = {
    id: '6',
    _type: 'contact_unassignment',
    created_at: date,
  };

  const instance = renderShallow(
    <JourneyItem item={item} myId={myId} personFirstName={person.first_name} />,
  ).instance();
  const ref = 'test';
  instance.ref(ref);
  expect(instance._view).toEqual(ref);
});
