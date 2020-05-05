import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { GLOBAL_COMMUNITY_ID } from '../../../constants';
import { GetCommunities_communities_nodes } from '../../../containers/Groups/__generated__/GetCommunities';

import GroupCardItem, { GroupCardItemProps } from '..';

const contactCount = 768;
const unassignedCount = 13;
const memberCount = 5;

const group: GetCommunities_communities_nodes = {
  __typename: 'Community',
  id: '1',
  communityPhotoUrl: null,
  name: 'Group Name',
  owner: {
    __typename: 'CommunityPersonConnection',
    nodes: [],
  },
  report: {
    __typename: 'CommunitiesReport',
    contactCount: 0,
    unassignedCount: 0,
    memberCount: 0,
  },
  userCreated: false,
  unreadCommentsCount: 0,
};

let props: GroupCardItemProps = {
  group,
  onPress: jest.fn(),
  onJoin: undefined,
};

const test = () => {
  renderWithContext(<GroupCardItem {...props} />, {
    noWrappers: true,
  }).snapshot();
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
        userCreated: true,
      },
    };

    test();
  });

  it('renders with no report counts for user created org', () => {
    props = {
      ...props,
      group: {
        ...group,
        report: {
          ...group.report,
          contactCount,
          unassignedCount,
        },
        userCreated: true,
      },
    };

    test();
  });

  it('renders with all report counts', () => {
    props = {
      ...props,
      group: {
        ...group,
        report: {
          ...group.report,
          contactCount,
          unassignedCount,
        },
        userCreated: false,
      },
    };

    test();
  });

  it('renders with unassigned, no contacts', () => {
    props = {
      ...props,
      group: {
        ...group,
        report: {
          ...group.report,
          unassignedCount,
        },
        userCreated: false,
      },
    };

    test();
  });

  it('renders with contacts, no unassigned', () => {
    props = {
      ...props,
      group: {
        ...group,
        report: {
          ...group.report,
          contactCount,
        },
        userCreated: false,
      },
    };

    test();
  });

  it('renders user created group', () => {
    props = {
      ...props,
      group: {
        ...group,
        userCreated: true,
      },
    };

    test();
  });

  it('renders user created group with member count', () => {
    props = {
      ...props,
      group: {
        ...group,
        report: {
          ...group.report,
          memberCount,
        },
        userCreated: true,
      },
    };

    test();
  });

  it('renders user created group with singular member count', () => {
    props = {
      ...props,
      group: {
        ...group,
        report: {
          ...group.report,
          memberCount: 1,
        },
        userCreated: true,
      },
    };

    test();
  });

  it('renders with image url', () => {
    props = {
      ...props,
      group: {
        ...group,
        communityPhotoUrl:
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
        unreadCommentsCount: 11,
      },
    };

    test();
  });

  it('renders for join screen', () => {
    props = {
      ...props,
      group: {
        ...group,
        report: {
          ...group.report,
          memberCount,
        },
        owner: {
          ...group.owner,
          nodes: [
            {
              __typename: 'Person',
              firstName: 'Roge',
              lastName: 'Egor',
            },
          ],
        },
      },
      onJoin: jest.fn(),
    };

    test();
  });

  it('renders for join screen userCreated no owner', () => {
    props = {
      ...props,
      group: {
        ...group,
        report: {
          ...group.report,
          memberCount,
        },
        userCreated: true,
      },
      onJoin: jest.fn(),
    };

    test();
  });

  it('calls props.onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = renderWithContext(
      <GroupCardItem group={group} onPress={onPress} />,
      { noWrappers: true },
    );
    fireEvent.press(getByTestId('CardButton'));

    expect(onPress).toHaveBeenCalled();
  });

  it('calls props.onJoin when pressed', () => {
    const onJoin = jest.fn();
    const { getByTestId } = renderWithContext(
      <GroupCardItem group={group} onJoin={onJoin} />,
      { noWrappers: true },
    );
    fireEvent.press(getByTestId('JoinButton'));

    expect(onJoin).toHaveBeenCalled();
  });
});
