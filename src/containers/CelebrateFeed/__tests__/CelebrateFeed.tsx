import React from 'react';
import { MockList } from 'graphql-tools';
import { flushMicrotasksQueue } from 'react-native-testing-library';
import { useQuery } from '@apollo/react-hooks';

import { GLOBAL_COMMUNITY_ID } from '../../../constants';
import { navigatePush } from '../../../actions/navigation';
import { renderWithContext } from '../../../../testUtils';
import { organizationSelector } from '../../../selectors/organizations';
import { Organization } from '../../../reducers/organizations';
import { Person } from '../../../reducers/people';
import { GET_COMMUNITY_FEED, GET_GLOBAL_COMMUNITY_FEED } from '../queries';

import { CelebrateFeed } from '..';

jest.mock('../../../actions/navigation');
jest.mock('../../../selectors/organizations');
jest.mock('../../../components/CommunityFeedItem', () => ({
  CommunityFeedItem: 'CommunityFeedItem',
}));
jest.mock('../../Groups/CreatePostButton', () => ({
  CreatePostButton: 'CreatePostButton',
}));
jest.mock('../../CelebrateFeedHeader', () => 'CelebrateFeedHeader');

const myId = '123';
const organization: Organization = { id: '456' };
const person: Person = { id: '789' };

const navigatePushResult = { type: 'navigated' };

const initialState = {
  auth: { person: { id: myId } },
  organizations: { all: [organization] },
  reportedComments: { all: { [organization.id]: [] } },
  swipe: { groupOnboarding: {} },
};

beforeEach(() => {
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResult);
  ((organizationSelector as unknown) as jest.Mock).mockReturnValue(
    organization,
  );
  jest.useFakeTimers();
});

it('renders empty correctly', () => {
  renderWithContext(
    <CelebrateFeed organization={organization} itemNamePressable={true} />,
    {
      initialState,
      mocks: {
        FeedItemConnection: () => ({
          nodes: () => new MockList(10),
        }),
      },
    },
  ).snapshot();
});

it('renders with items correctly', async () => {
  const { snapshot } = renderWithContext(
    <CelebrateFeed organization={organization} itemNamePressable={true} />,
    {
      initialState,
      mocks: {
        FeedItemConnection: () => ({
          nodes: () => new MockList(10),
        }),
      },
    },
  );

  await flushMicrotasksQueue();
  snapshot();

  expect(useQuery).toHaveBeenCalledWith(GET_COMMUNITY_FEED, {
    skip: false,
    variables: {
      communityId: organization.id,
      hasUnreadComments: undefined,
      personIds: undefined,
    },
  });
  expect(useQuery).toHaveBeenCalledWith(GET_GLOBAL_COMMUNITY_FEED, {
    skip: true,
  });
});

describe('renders for member', () => {
  it('renders correctly', async () => {
    const { snapshot } = renderWithContext(
      <CelebrateFeed
        organization={organization}
        person={person}
        itemNamePressable={true}
      />,
      {
        initialState,
        mocks: {
          FeedItemConnection: () => ({
            nodes: () => new MockList(10),
          }),
        },
      },
    );

    await flushMicrotasksQueue();
    snapshot();

    expect(useQuery).toHaveBeenCalledWith(GET_COMMUNITY_FEED, {
      skip: false,
      variables: {
        communityId: organization.id,
        hasUnreadComments: undefined,
        personIds: person.id,
      },
    });
    expect(useQuery).toHaveBeenCalledWith(GET_GLOBAL_COMMUNITY_FEED, {
      skip: true,
    });
  });

  it('renders without header', async () => {
    const { snapshot } = renderWithContext(
      <CelebrateFeed
        organization={organization}
        person={person}
        itemNamePressable={true}
        noHeader={true}
      />,
      {
        initialState,
        mocks: {
          FeedItemConnection: () => ({
            nodes: () => new MockList(10),
          }),
        },
      },
    );

    await flushMicrotasksQueue();
    snapshot();

    expect(useQuery).toHaveBeenCalledWith(GET_COMMUNITY_FEED, {
      skip: false,
      variables: {
        communityId: organization.id,
        hasUnreadComments: undefined,
        personIds: person.id,
      },
    });
    expect(useQuery).toHaveBeenCalledWith(GET_GLOBAL_COMMUNITY_FEED, {
      skip: true,
    });
  });
});

describe('renders with clear notification', () => {
  it('renders correctly', async () => {
    const { snapshot } = renderWithContext(
      <CelebrateFeed
        organization={organization}
        itemNamePressable={true}
        onClearNotification={jest.fn()}
      />,
      {
        initialState,
        mocks: {
          FeedItemConnection: () => ({
            nodes: () => new MockList(10),
          }),
        },
      },
    );

    await flushMicrotasksQueue();
    snapshot();

    expect(useQuery).toHaveBeenCalledWith(GET_COMMUNITY_FEED, {
      skip: false,
      variables: {
        communityId: organization.id,
        hasUnreadComments: undefined,
        personIds: undefined,
      },
    });
    expect(useQuery).toHaveBeenCalledWith(GET_GLOBAL_COMMUNITY_FEED, {
      skip: true,
    });
  });
});

describe('renders for Unread Comments', () => {
  it('renders correctly', async () => {
    const { snapshot } = renderWithContext(
      <CelebrateFeed
        organization={organization}
        itemNamePressable={true}
        showUnreadOnly={true}
      />,
      {
        initialState,
        mocks: {
          FeedItemConnection: () => ({
            nodes: () => new MockList(10),
          }),
        },
      },
    );

    await flushMicrotasksQueue();
    snapshot();

    expect(useQuery).toHaveBeenCalledWith(GET_COMMUNITY_FEED, {
      skip: false,
      variables: {
        communityId: organization.id,
        hasUnreadComments: true,
        personIds: undefined,
      },
    });
    expect(useQuery).toHaveBeenCalledWith(GET_GLOBAL_COMMUNITY_FEED, {
      skip: true,
    });
  });
});

describe('renders for Global Community', () => {
  it('renders correctly', async () => {
    const { snapshot } = renderWithContext(
      <CelebrateFeed
        organization={{ ...organization, id: GLOBAL_COMMUNITY_ID }}
        itemNamePressable={true}
      />,
      {
        initialState,
        mocks: {
          FeedItemConnection: () => ({
            nodes: () => new MockList(10),
          }),
        },
      },
    );

    await flushMicrotasksQueue();
    snapshot();

    expect(useQuery).toHaveBeenCalledWith(GET_COMMUNITY_FEED, {
      skip: true,
      variables: {
        communityId: GLOBAL_COMMUNITY_ID,
        hasUnreadComments: undefined,
        personIds: undefined,
      },
    });
    expect(useQuery).toHaveBeenCalledWith(GET_GLOBAL_COMMUNITY_FEED, {
      skip: false,
    });
  });
});
