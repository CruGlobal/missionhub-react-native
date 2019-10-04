import React from 'react';

import { testSnapshotShallow, renderShallow } from '../../../../testUtils';
import { GLOBAL_COMMUNITY_ID } from '../../../constants';

import GroupCardItem from '..';

const contactsCount = 768;
const unassignedCount = 13;
const memberCount = 5;

const group = {
  name: 'Group Name',
  contactReport: {},
  user_created: false,
  unread_comments_count: 0,
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

  it('renders for global community', () => {
    props = {
      ...props,
      group: {
        ...group,
        id: GLOBAL_COMMUNITY_ID,
        user_created: true,
      },
    };

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
    props = {
      ...props,
      group: {
        ...group,
        contactReport: {
          memberCount,
        },
        user_created: true,
      },
    };

    test();
  });

  it('renders user created group with singular member count', () => {
    props = {
      ...props,
      group: {
        ...group,
        contactReport: {
          memberCount: 1,
        },
        user_created: true,
      },
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

  it('renders with notification', () => {
    props = {
      ...props,
      group: {
        ...group,
        unread_comments_count: 11,
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
          memberCount,
        },
        owner: { first_name: 'Roge' },
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
      .childAt(0)
      .childAt(1)
      .childAt(1)
      .childAt(0)
      .simulate('press');

    expect(onJoin).toHaveBeenCalled();
  });
});
