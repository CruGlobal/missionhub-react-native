import React from 'react';

import GroupCardItem from '../../src/components/GroupCardItem';
import { testSnapshotShallow, renderShallow } from '../../testUtils';

let group = {
  name: 'Group Name',
  contacts: 768,
};

const test = () => {
  testSnapshotShallow(<GroupCardItem group={group} />);
};

describe('GroupCardItem', () => {
  it('renders with unassigned and uncontacted', () => {
    group = {
      ...group,
      unassigned: 13,
      uncontacted: 56,
    };

    test();
  });

  it('renders with unassigned and no uncontacted', () => {
    group = {
      ...group,
      unassigned: 13,
      uncontacted: 0,
    };

    test();
  });

  it('renders with uncontacted and no unassigned', () => {
    group = {
      ...group,
      unassigned: 0,
      uncontacted: 56,
    };

    test();
  });

  it('renders with no unassigned and no uncontacted', () => {
    group = {
      ...group,
      unassigned: 0,
      uncontacted: 0,
    };

    test();
  });

  it('calls props.onPress when pressed', () => {
    const onPress = jest.fn();
    const component = renderShallow(
      <GroupCardItem group={group} onPress={onPress} />,
    );

    component.simulate('press');

    expect(onPress).toHaveBeenCalled();
  });
});
