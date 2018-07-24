import React from 'react';

import { testSnapshotShallow } from '../../testUtils';
import GroupsContactList from '../../src/components/GroupsContactList';

const person = {
  id: '123',
  full_name: 'Full Name',
};
const organization = {
  id: '900',
  name: "Roge's org",
};

const activity = [
  {
    id: '1',
    created_at: '2018-05-29T17:02:02Z',
    text: 'Someone had a spiritual conversation',
    comment: 'Some comment',
    type: 'interaction',
    interaction_type_id: 2,
  },
  {
    id: '2',
    created_at: '2018-05-29T17:02:02Z',
    text: 'Someone else had a spiritual conversation',
    comment: '',
    type: 'interaction',
    interaction_type_id: 2,
  },
  {
    id: '3',
    created_at: '2018-05-29T17:02:02Z',
    text: 'Someone else had a gospel conversation',
    comment: '',
    type: 'interaction',
    interaction_type_id: 3,
  },
  {
    id: '4',
    created_at: '2018-05-29T17:02:02Z',
    text: 'Someone else had a spiritual conversation',
  },
  {
    id: '5',
    created_at: '2018-05-29T17:02:02Z',
    text: 'Someone else had a spiritual conversation',
  },
];

it('renders activity list', () => {
  testSnapshotShallow(
    <GroupsContactList
      onAssign={jest.fn()}
      activity={activity}
      person={person}
      organization={organization}
      myId="1"
    />,
  );
});

it('renders empty list', () => {
  testSnapshotShallow(
    <GroupsContactList
      onAssign={jest.fn()}
      activity={[]}
      person={person}
      organization={organization}
      myId="1"
    />,
  );
});
