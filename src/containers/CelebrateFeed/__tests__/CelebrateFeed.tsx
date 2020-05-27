/* eslint max-lines: 0 */
import React from 'react';
import { Animated } from 'react-native';
import { MockList } from 'graphql-tools';
import { flushMicrotasksQueue, fireEvent } from 'react-native-testing-library';
import { useQuery } from '@apollo/react-hooks';
import MockDate from 'mockdate';

import { GLOBAL_COMMUNITY_ID } from '../../../constants';
import { navigatePush } from '../../../actions/navigation';
import { renderWithContext } from '../../../../testUtils';
import { organizationSelector } from '../../../selectors/organizations';
import { Organization } from '../../../reducers/organizations';
import { Person } from '../../../reducers/people';
import { GET_COMMUNITY_FEED, GET_GLOBAL_COMMUNITY_FEED } from '../queries';
import { FeedItemSubjectTypeEnum } from '../../../../__generated__/globalTypes';

import { CelebrateFeed } from '..';

jest.mock('../../../actions/navigation');
jest.mock('../../../selectors/organizations');
jest.mock('../../../components/CommunityFeedItem', () => ({
  CommunityFeedItem: 'CommunityFeedItem',
}));
jest.mock('../../../components/PostTypeLabel', () => ({
  PostTypeCardWithPeople: 'PostTypeCardWithPeople',
}));
jest.mock('../../Groups/CreatePostButton', () => ({
  CreatePostButton: 'CreatePostButton',
}));

jest.mock('../../../containers/CelebrateFeedPostCards', () => ({
  CelebrateFeedPostCards: 'CelebrateFeedPostCards',
}));

const myId = '123';
const organization: Organization = { id: '456' };
const person: Person = { id: '789' };
const mockDate = '2020-05-20 12:00:00 PM GMT+0';

MockDate.set(mockDate);
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

describe('sections', () => {
  it('renders New section', async () => {
    const { snapshot } = renderWithContext(
      <CelebrateFeed organization={organization} itemNamePressable={true} />,
      {
        initialState,
        mocks: {
          FeedItemConnection: () => ({
            nodes: () =>
              new MockList(1, () => ({
                read: false,
                createdAt: '2020-05-20 11:00:00 PM GMT+0',
              })),
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

  it('renders Today section', async () => {
    const { snapshot } = renderWithContext(
      <CelebrateFeed organization={organization} itemNamePressable={true} />,
      {
        initialState,
        mocks: {
          FeedItemConnection: () => ({
            nodes: () =>
              new MockList(1, () => ({
                read: true,
                createdAt: '2020-05-20 11:00:00 PM GMT+0',
              })),
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

  it('renders Earlier section', async () => {
    const { snapshot } = renderWithContext(
      <CelebrateFeed organization={organization} itemNamePressable={true} />,
      {
        initialState,
        mocks: {
          FeedItemConnection: () => ({
            nodes: () =>
              new MockList(1, () => ({
                read: true,
                createdAt: '2020-05-18 11:00:00 PM GMT+0',
              })),
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
          FeedItemConnection: () => ({ nodes: () => new MockList(10) }),
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

  it('renders with type', async () => {
    const { snapshot } = renderWithContext(
      <CelebrateFeed
        organization={organization}
        person={person}
        itemNamePressable={true}
        filteredFeedType={FeedItemSubjectTypeEnum.STEP}
      />,
      {
        initialState,
        mocks: { FeedItemConnection: () => ({ nodes: () => new MockList(1) }) },
      },
    );

    await flushMicrotasksQueue();
    snapshot();
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

describe('handle refreshing', () => {
  it('refreshes community feed', async () => {
    const onRefetch = jest.fn();

    const { getByType } = renderWithContext(
      <CelebrateFeed
        organization={organization}
        itemNamePressable={true}
        onRefetch={onRefetch}
      />,
      {
        initialState,
        mocks: { FeedItemConnection: () => ({ nodes: () => new MockList(1) }) },
      },
    );

    await flushMicrotasksQueue();

    fireEvent(getByType(Animated.SectionList), 'onRefresh');

    expect(onRefetch).toHaveBeenCalledWith();
  });

  it('refreshes global community feed', async () => {
    const onRefetch = jest.fn();

    const { getByType } = renderWithContext(
      <CelebrateFeed
        organization={{ ...organization, id: GLOBAL_COMMUNITY_ID }}
        itemNamePressable={true}
        onRefetch={onRefetch}
      />,
      {
        initialState,
        mocks: { FeedItemConnection: () => ({ nodes: () => new MockList(1) }) },
      },
    );

    await flushMicrotasksQueue();

    fireEvent(getByType(Animated.SectionList), 'onRefresh');

    expect(onRefetch).toHaveBeenCalledWith();
  });
});

describe('handle pagination', () => {
  describe('community feed pagination', () => {
    let mocks = {};

    const testScroll = async () => {
      const { recordSnapshot, diffSnapshot, getByType } = renderWithContext(
        <CelebrateFeed organization={organization} itemNamePressable={true} />,
        {
          initialState,
          mocks,
        },
      );

      await flushMicrotasksQueue();

      const scrollDown = () =>
        fireEvent(getByType(Animated.SectionList), 'onEndReached');

      return {
        scrollDown,
        recordSnapshot,
        diffSnapshot,
        flushMicrotasksQueue,
      };
    };

    it('paginates when close to bottom', async () => {
      mocks = {
        FeedItemConnection: () => ({
          nodes: () => new MockList(10),
          pageInfo: () => ({ hasNextPage: true }),
        }),
      };

      const {
        scrollDown,
        recordSnapshot,
        diffSnapshot,
        flushMicrotasksQueue,
      } = await testScroll();

      recordSnapshot();

      scrollDown();
      await flushMicrotasksQueue();

      diffSnapshot();
    });

    it('should not load more when no next page', async () => {
      mocks = {
        FeedItemConnection: () => ({
          nodes: () => new MockList(10),
          pageInfo: () => ({ hasNextPage: false }),
        }),
      };

      const {
        scrollDown,
        recordSnapshot,
        diffSnapshot,
        flushMicrotasksQueue,
      } = await testScroll();

      recordSnapshot();

      scrollDown();
      await flushMicrotasksQueue();

      diffSnapshot();
    });
  });

  describe('global community feed pagination', () => {
    let mocks = {};

    const testScroll = async () => {
      const { recordSnapshot, diffSnapshot, getByType } = renderWithContext(
        <CelebrateFeed
          organization={{ ...organization, id: GLOBAL_COMMUNITY_ID }}
          itemNamePressable={true}
        />,
        {
          initialState,
          mocks,
        },
      );

      await flushMicrotasksQueue();

      const scrollDown = () =>
        fireEvent(getByType(Animated.SectionList), 'onEndReached');

      return {
        scrollDown,
        recordSnapshot,
        diffSnapshot,
        flushMicrotasksQueue,
      };
    };

    it('paginates when close to bottom', async () => {
      mocks = {
        FeedItemConnection: () => ({
          nodes: () => new MockList(10),
          pageInfo: () => ({ hasNextPage: true }),
        }),
      };

      const {
        scrollDown,
        recordSnapshot,
        diffSnapshot,
        flushMicrotasksQueue,
      } = await testScroll();

      recordSnapshot();

      scrollDown();
      await flushMicrotasksQueue();

      diffSnapshot();
    });

    it('should not load more when no next page', async () => {
      mocks = {
        FeedItemConnection: () => ({
          nodes: () => new MockList(10),
          pageInfo: () => ({ hasNextPage: false }),
        }),
      };

      const {
        scrollDown,
        recordSnapshot,
        diffSnapshot,
        flushMicrotasksQueue,
      } = await testScroll();

      recordSnapshot();

      scrollDown();
      await flushMicrotasksQueue();

      diffSnapshot();
    });
  });
});
