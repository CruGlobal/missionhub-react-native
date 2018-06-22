import React from 'react';

import { testSnapshotShallow } from '../../testUtils';
import GroupsContactItem from '../../src/components/GroupsContactItem';

const item = {
  id: '1',
  created_at: '2018-05-29T17:02:02Z',
  text: 'Someone had a spiritual conversation',
  comment: 'Some comment',
  _type: 'interaction',
  interaction_type_id: 2,
};

const person = {
  full_name: 'Test User',
};

it('renders item', () => {
  testSnapshotShallow(<GroupsContactItem person={person} item={item} />);
});

it('renders survey item', () => {
  testSnapshotShallow(
    <GroupsContactItem
      person={person}
      item={{
        id: '1',
        created_at: '2018-05-29T17:02:02Z',
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
  testSnapshotShallow(
    <GroupsContactItem
      person={person}
      item={{
        ...item,
        _type: 'contact_assignment',
      }}
    />,
  );
});

it('renders contact unassignment item', () => {
  testSnapshotShallow(
    <GroupsContactItem
      person={person}
      item={{
        ...item,
        _type: 'contact_unassignment',
      }}
    />,
  );
});
