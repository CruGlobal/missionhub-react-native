import React from 'react';

import GroupCardItem from '..';

import { testSnapshotShallow, renderShallow } from '../../../../testUtils';

const contactsCount = 768;
const unassignedCount = 13;
const memberCount = 5;

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
      },
      user_created: false,
    };

    test();
  });

  it('renders with unassigned, no contacts', () => {
    group = {
      ...group,
      contactReport: {
        unassignedCount,
      },
      user_created: false,
    };

    test();
  });

  it('renders with contacts, no unassigned', () => {
    group = {
      ...group,
      contactReport: {
        contactsCount,
      },
      user_created: false,
    };

    test();
  });

  it('renders user created group', () => {
    group = {
      ...group,
      user_created: true,
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
    group = {
      ...group,
      community_photo_url:
        'https://vignette.wikia.nocookie.net/edain-mod/images/6/6e/Mordor_Submod_Banner.jpg',
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
