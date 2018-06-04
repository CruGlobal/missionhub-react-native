import React from 'react';

import { testSnapshotShallow } from '../../testUtils';
import GroupsContactItem from '../../src/components/GroupsContactItem';

const item = {
  id: '1',
  created_at: '2018-05-29T17:02:02Z',
  text: 'Someone had a spiritual conversation',
  comment: 'Some comment',
  type: 'interaction',
  interaction_type_id: 2,
};

it('renders item', () => {
  testSnapshotShallow(<GroupsContactItem item={item} />);
});
