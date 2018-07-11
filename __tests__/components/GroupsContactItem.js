import React from 'react';

import { testSnapshotShallow } from '../../testUtils';
import GroupsContactItem from '../../src/components/GroupsContactItem';
import {
  getIconName,
  getAssignedByName,
  getAssignedToName,
} from '../../src/utils/common';

jest.mock('../../src/utils/common');

const created_at = '2018-05-29T17:02:02Z';
const item = {
  id: '1',
  created_at,
  text: 'Someone had a spiritual conversation',
  comment: 'Some comment',
  _type: 'interaction',
  interaction_type_id: 2,
  initiators: [{ full_name: 'Someone' }],
  receiver: { first_name: 'Contact' },
};

const person = {
  first_name: 'Test User',
};

const myId = '234234';

beforeEach(() => {
  getAssignedToName.mockReset();
  getAssignedByName.mockReset();

  getAssignedByName.mockReturnValue('Captain America');
  getAssignedToName.mockReturnValue('Iron Man');
});

it('renders item', () => {
  getIconName.mockReturnValue('spiritualConversationIcon');

  testSnapshotShallow(
    <GroupsContactItem person={person} item={item} myId={myId} />,
  );
});

it('renders survey item', () => {
  getIconName.mockReset();

  testSnapshotShallow(
    <GroupsContactItem
      person={person}
      myId={myId}
      item={{
        id: '1',
        created_at,
        _type: 'answer_sheet',
        survey: {
          title: 'Survey Title',
        },
        answers: [
          { id: 'a1', question: { label: 'Label 1' }, value: 'Answer 1' },
        ],
      }}
    />,
  );
});

it('renders contact assignment item', () => {
  getIconName.mockReturnValue('journeyWarning');
  const newItem = {
    ...item,
    _type: 'contact_assignment',
    created_at,
  };

  testSnapshotShallow(
    <GroupsContactItem person={person} item={newItem} myId={myId} />,
  );

  expect(getAssignedToName).toHaveBeenCalledWith(myId, newItem);
  expect(getAssignedByName).toHaveBeenCalledWith(myId, newItem);
});

it('renders contact unassignment item', () => {
  getIconName.mockReturnValue('journeyWarning');
  const newItem = {
    ...item,
    _type: 'contact_unassignment',
    created_at,
  };

  testSnapshotShallow(
    <GroupsContactItem person={person} item={newItem} myId={myId} />,
  );

  expect(getAssignedToName).toHaveBeenCalledWith(myId, newItem);
});
