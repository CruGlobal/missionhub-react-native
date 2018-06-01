import React from 'react';

import { renderShallow, testSnapshotShallow } from '../../testUtils';
import GroupMemberItem from '../../src/components/GroupMemberItem';

const member = {
  id: '123',
  full_name: 'Full Name',
  assignedNum: 5,
  uncontactedNum: 3,
};

it('render member', () => {
  testSnapshotShallow(<GroupMemberItem onSelect={jest.fn()} person={member} />);
});

it('render 0 assigned', () => {
  testSnapshotShallow(
    <GroupMemberItem
      onSelect={jest.fn()}
      person={{ ...member, assignedNum: 0 }}
    />,
  );
});

it('render 0 uncontacted', () => {
  testSnapshotShallow(
    <GroupMemberItem
      onSelect={jest.fn()}
      person={{ ...member, uncontactedNum: 0 }}
    />,
  );
});

it('calls onSelect prop', () => {
  const onSelect = jest.fn();

  renderShallow(<GroupMemberItem onSelect={onSelect} person={member} />)
    .instance()
    .handleSelect();

  expect(onSelect).toHaveBeenCalled();
});
