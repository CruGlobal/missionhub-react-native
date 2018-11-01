import React from 'react';

import GroupCardItem from '..';

import { testSnapshotShallow, renderShallow } from '../../../../testUtils';

const contactsCount = 768;
const unassignedCount = 13;
const uncontactedCount = 56;

let group = {
  name: 'Group Name',
  contactReport: {},
  user_created: false,
};

const test = () => {
  testSnapshotShallow(<GroupCardItem group={group} />);
};

describe('GroupCardItem', () => {
  it('renders with no report counts', () => {
    test();
  });

  it('renders with no report counts for user created org', () => {
    group = {
      ...group,
      contactReport: {
        contactsCount,
        unassignedCount,
        uncontactedCount,
      },
      user_created: true,
    };

    test();
  });

  it('renders with all report counts', () => {
    group = {
      ...group,
      contactReport: {
        contactsCount,
        unassignedCount,
        uncontactedCount,
      },
      user_created: false,
    };

    test();
  });

  it('renders with contacts and unassigned, no uncontacted', () => {
    group = {
      ...group,
      contactReport: {
        contactsCount,
        unassignedCount,
      },
      user_created: false,
    };

    test();
  });

  it('renders with contacts and uncontacted, no unassigned', () => {
    group = {
      ...group,
      contactReport: {
        contactsCount,
        uncontactedCount,
      },
      user_created: false,
    };

    test();
  });

  it('renders with contacts, no unassigned and no uncontacted', () => {
    group = {
      ...group,
      contactReport: {
        contactsCount,
      },
      user_created: false,
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
