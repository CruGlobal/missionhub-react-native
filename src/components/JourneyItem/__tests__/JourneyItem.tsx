import 'react-native';
import React from 'react';

import { getAssignedByName, getAssignedToName } from '../../../utils/common';
import { renderWithContext } from '../../../../testUtils';
import { ACCEPTED_STEP } from '../../../constants';
import JourneyItem from '..';

jest.mock('../../../utils/common');

const myId = '484893';
const person = {
  id: '889433',
  _type: 'person',
  first_name: 'Test Person',
};
const date = '2017-12-06T14:24:52Z';

beforeEach(() => {
  // @ts-ignore
  getAssignedToName.mockReturnValue('Roger');
  // @ts-ignore
  getAssignedByName.mockReturnValue('Billy');
});

describe('step', () => {
  const mockStep = {
    id: '1',
    _type: ACCEPTED_STEP,
    title: 'Test Step',
    completed_at: date,
  };
  const challenge_suggestion = {
    pathway_stage: {
      name: 'Guiding',
    },
  };

  it('is rendered correctly without comment', () => {
    renderWithContext(
      <JourneyItem
        // @ts-ignore
        item={mockStep}
        myId={myId}
        personFirstName={person.first_name}
      />,
      { noWrappers: true },
    ).snapshot();
  });

  it('is rendered correctly with comment', () => {
    renderWithContext(
      <JourneyItem
        // @ts-ignore
        item={{ ...mockStep, note: 'test comment on completed step' }}
        myId={myId}
        personFirstName={person.first_name}
      />,
      { noWrappers: true },
    ).snapshot();
  });

  it('is rendered correctly with pathway stage', () => {
    renderWithContext(
      <JourneyItem
        // @ts-ignore
        item={{ ...mockStep, challenge_suggestion }}
        myId={myId}
        personFirstName={person.first_name}
      />,
      { noWrappers: true },
    ).snapshot();
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
    renderWithContext(
      <JourneyItem
        // @ts-ignore
        item={mockStageProgression}
        myId={myId}
        personFirstName={person.first_name}
      />,
      { noWrappers: true },
    ).snapshot();
  });

  it('is rendered correctly with old stage for self', () => {
    renderWithContext(
      <JourneyItem
        // @ts-ignore
        item={mockStageProgression}
        myId={person.id}
        personFirstName={person.first_name}
      />,
      { noWrappers: true },
    ).snapshot();
  });

  it('is rendered correctly without old stage for a contact', () => {
    renderWithContext(
      <JourneyItem
        // @ts-ignore
        item={{
          ...mockStageProgression,
          old_pathway_stage: {},
        }}
        myId={myId}
        personFirstName={person.first_name}
      />,
      { noWrappers: true },
    ).snapshot();
  });

  it('is rendered correctly without old stage for self', () => {
    renderWithContext(
      <JourneyItem
        // @ts-ignore
        item={{
          ...mockStageProgression,
          old_pathway_stage: {},
        }}
        myId={person.id}
        personFirstName={person.first_name}
      />,
      { noWrappers: true },
    ).snapshot();
  });
});

it('renders survey correctly', () => {
  renderWithContext(
    <JourneyItem
      // @ts-ignore
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
    { noWrappers: true },
  ).snapshot();
});

it('renders interaction correctly', () => {
  renderWithContext(
    <JourneyItem
      // @ts-ignore
      item={{
        id: '4',
        _type: 'interaction',
        interaction_type_id: '1',
        comment: 'Test Interaction',
        initiators: [{ id: myId }],
        organization: null,
        created_at: date,
      }}
      myId={myId}
      personFirstName={person.first_name}
    />,
    { noWrappers: true },
  ).snapshot();
});

it('renders contact_assignment correctly', () => {
  const item = {
    id: '5',
    _type: 'contact_assignment',
    created_at: date,
  };

  renderWithContext(
    // @ts-ignore
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

  renderWithContext(
    // @ts-ignore
    <JourneyItem item={item} myId={myId} personFirstName={person.first_name} />,
  );

  expect(getAssignedToName).toHaveBeenCalledWith(myId, item);
});
