import React from 'react';

import GroupCardItem from '..';

import { testSnapshotShallow, renderShallow } from '../../../../testUtils';

const contactsCount = 768;
const unassignedCount = 13;
const memberCount = 5;

const group = {
  name: 'Group Name',
  contactReport: {},
  user_created: false,
};

let props = {
  group,
  onPress: jest.fn(),
  onJoin: undefined,
};

const test = () => {
  testSnapshotShallow(<GroupCardItem {...props} />);
};

describe('GroupCardItem', () => {
  it('renders with no report counts', () => {
    test();
  });

  it('renders with no report counts for user created org', () => {
    props = {
      ...props,
      group: {
        ...group,
        contactReport: {
          contactsCount,
          unassignedCount,
        },
        user_created: true,
      },
    };

    test();
  });

  it('renders with all report counts', () => {
    props = {
      ...props,
      group: {
        ...group,
        contactReport: {
          contactsCount,
          unassignedCount,
        },
        user_created: false,
      },
    };

    test();
  });

  it('renders with unassigned, no contacts', () => {
    props = {
      ...props,
      group: {
        ...group,
        contactReport: {
          unassignedCount,
        },
        user_created: false,
      },
    };

    test();
  });

  it('renders with contacts, no unassigned', () => {
    props = {
      ...props,
      group: {
        ...group,
        contactReport: {
          contactsCount,
        },
        user_created: false,
      },
    };

    test();
  });

  it('renders user created group', () => {
    props = {
      ...props,
      group: {
        ...group,
        user_created: true,
      },
    };

    test();
  });

  it('renders user created group with member count', () => {
    group = {
      ...group,
      contactReport: {
        memberCount,
      },
      user_created: true,
    };

    test();
  });

  it('renders user created group with singular member count', () => {
    group = {
      ...group,
      contactReport: {
        memberCount: 1,
      },
      user_created: true,
    };

    test();
  });

  it('renders with image url', () => {
    props = {
      ...props,
      group: {
        ...group,
        community_photo_url:
          'https://vignette.wikia.nocookie.net/edain-mod/images/6/6e/Mordor_Submod_Banner.jpg',
      },
    };

    test();
  });

  it('renders for join screen', () => {
    props = {
      ...props,
      group: {
        ...group,
        contactReport: {
          membersCount,
        },
        owner: 'Roge',
      },
      onJoin: jest.fn(),
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

  it('calls props.onJoin when pressed', () => {
    const onJoin = jest.fn();
    const component = renderShallow(
      <GroupCardItem group={group} onJoin={onJoin} />,
    );

    component
      .childAt(1)
      .childAt(1)
      .childAt(0)
      .simulate('press');

    expect(onJoin).toHaveBeenCalled();
  });
});
