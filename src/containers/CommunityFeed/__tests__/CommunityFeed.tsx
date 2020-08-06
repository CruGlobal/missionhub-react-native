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
import { GET_COMMUNITY_FEED, GET_GLOBAL_COMMUNITY_FEED } from '../queries';
import {
  FeedItemSubjectTypeEnum,
  PostTypeEnum,
} from '../../../../__generated__/globalTypes';
import { CommunityFeed } from '..';
import { StoredCreatePost } from '../../../reducers/communityPosts';

jest.mock('../../../actions/navigation');
jest.mock('../../../selectors/organizations');
jest.mock('../../../components/CommunityFeedItem', () => ({
  CommunityFeedItem: 'CommunityFeedItem',
}));
jest.mock('../../../components/PostTypeLabel', () => ({
  PostTypeBgStyle: 'PostTypeBgStyle',
  PostTypeColorStyle: 'PostTypeColorStyle',
  PostTypeCardWithPeople: 'PostTypeCardWithPeople',
  PostTypeNullState: 'PostTypeNullState',
}));
jest.mock('../../Groups/CreatePostButton', () => ({
  CreatePostButton: 'CreatePostButton',
}));
jest.mock('../../../containers/CommunityFeedPostCards', () => ({
  CommunityFeedPostCards: 'CommunityFeedPostCards',
}));
jest.mock('../../../components/PendingFeedItem', () => ({
  PendingFeedItem: 'PendingFeedItem',
}));

const myId = '123';
const communityId = '456';
const personId = '789';
const mockDate = '2020-05-20 12:00:00 PM GMT+0';

MockDate.set(mockDate);
const navigatePushResult = { type: 'navigated' };

const initialState = {
  auth: { person: { id: myId } },
  swipe: { groupOnboarding: {} },
  communityPosts: { pendingPosts: {} },
};

beforeEach(() => {
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResult);
  jest.useFakeTimers();
});

it('renders empty correctly', () => {
  renderWithContext(
    <CommunityFeed communityId={communityId} itemNamePressable={true} />,
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
    <CommunityFeed communityId={communityId} itemNamePressable={true} />,
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
      communityId,
      hasUnreadComments: undefined,
      personIds: undefined,
    },
  });
  expect(useQuery).toHaveBeenCalledWith(GET_GLOBAL_COMMUNITY_FEED, {
    variables: {},
    skip: true,
  });
});

it('renders with pending post correctly', async () => {
  const pendingPost: StoredCreatePost = {
    content: 'text',
    media: 'video.mov',
    communityId,
    postType: PostTypeEnum.story,
    storageId: '123',
    failed: false,
  };

  const { snapshot } = renderWithContext(
    <CommunityFeed communityId={communityId} itemNamePressable={true} />,
    {
      initialState: {
        ...initialState,
        communityPosts: {
          pendingPosts: {
            [pendingPost.storageId]: pendingPost,
          },
        },
      },
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
      communityId,
      hasUnreadComments: undefined,
      personIds: undefined,
    },
  });
  expect(useQuery).toHaveBeenCalledWith(GET_GLOBAL_COMMUNITY_FEED, {
    variables: {},
    skip: true,
  });
});

it('renders with pending post without Today items correctly', async () => {
  const pendingPost: StoredCreatePost = {
    content: 'text',
    media: 'video.mov',
    communityId,
    postType: PostTypeEnum.story,
    storageId: '123',
    failed: false,
  };

  const { snapshot } = renderWithContext(
    <CommunityFeed communityId={communityId} itemNamePressable={true} />,
    {
      initialState: {
        ...initialState,
        communityPosts: {
          pendingPosts: {
            [pendingPost.storageId]: pendingPost,
          },
        },
      },
      mocks: {
        FeedItemConnection: () => ({
          nodes: () =>
            new MockList(10, () => ({
              read: true,
              createdAt: '2020-05-10 11:00:00 PM GMT+0',
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
      communityId,
      hasUnreadComments: undefined,
      personIds: undefined,
    },
  });
  expect(useQuery).toHaveBeenCalledWith(GET_GLOBAL_COMMUNITY_FEED, {
    variables: {},
    skip: true,
  });
});

describe('sections', () => {
  it('renders New section for filtered feed', async () => {
    const { snapshot } = renderWithContext(
      <CommunityFeed
        communityId={communityId}
        itemNamePressable={true}
        filteredFeedType={FeedItemSubjectTypeEnum.STORY}
      />,
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
        communityId,
        hasUnreadComments: undefined,
        personIds: undefined,
        subjectType: [FeedItemSubjectTypeEnum.STORY],
      },
    });
    expect(useQuery).toHaveBeenCalledWith(GET_GLOBAL_COMMUNITY_FEED, {
      variables: {
        subjectType: FeedItemSubjectTypeEnum.STORY,
      },
      skip: true,
    });
  });

  it('does not render New section for community feed', async () => {
    const { snapshot } = renderWithContext(
      <CommunityFeed communityId={communityId} itemNamePressable={true} />,
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
        communityId,
        hasUnreadComments: undefined,
        personIds: undefined,
      },
    });
    expect(useQuery).toHaveBeenCalledWith(GET_GLOBAL_COMMUNITY_FEED, {
      variables: {},
      skip: true,
    });
  });

  it('does not render New section for global feed', async () => {
    const { snapshot } = renderWithContext(
      <CommunityFeed
        communityId={GLOBAL_COMMUNITY_ID}
        itemNamePressable={true}
      />,
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
      skip: true,
      variables: {
        communityId: GLOBAL_COMMUNITY_ID,
        hasUnreadComments: undefined,
        personIds: undefined,
      },
    });
    expect(useQuery).toHaveBeenCalledWith(GET_GLOBAL_COMMUNITY_FEED, {
      variables: {},
      skip: false,
    });
  });

  it('renders Today section', async () => {
    const { snapshot } = renderWithContext(
      <CommunityFeed communityId={communityId} itemNamePressable={true} />,
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
        communityId,
        hasUnreadComments: undefined,
        personIds: undefined,
      },
    });
    expect(useQuery).toHaveBeenCalledWith(GET_GLOBAL_COMMUNITY_FEED, {
      variables: {},
      skip: true,
    });
  });

  it('renders Earlier section', async () => {
    const { snapshot } = renderWithContext(
      <CommunityFeed communityId={communityId} itemNamePressable={true} />,
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
        communityId,
        hasUnreadComments: undefined,
        personIds: undefined,
      },
    });
    expect(useQuery).toHaveBeenCalledWith(GET_GLOBAL_COMMUNITY_FEED, {
      variables: {},
      skip: true,
    });
  });
});

describe('renders for member', () => {
  it('renders correctly', async () => {
    const { snapshot } = renderWithContext(
      <CommunityFeed
        communityId={communityId}
        personId={personId}
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
        communityId,
        hasUnreadComments: undefined,
        personIds: [personId],
      },
    });
    expect(useQuery).toHaveBeenCalledWith(GET_GLOBAL_COMMUNITY_FEED, {
      variables: {},
      skip: true,
    });
  });

  it('renders without header', async () => {
    const { snapshot } = renderWithContext(
      <CommunityFeed
        communityId={communityId}
        personId={personId}
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
        communityId,
        hasUnreadComments: undefined,
        personIds: [personId],
      },
    });
    expect(useQuery).toHaveBeenCalledWith(GET_GLOBAL_COMMUNITY_FEED, {
      variables: {},
      skip: true,
    });
  });

  it('renders with type', async () => {
    const { snapshot } = renderWithContext(
      <CommunityFeed
        communityId={communityId}
        personId={personId}
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
      <CommunityFeed
        communityId={communityId}
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
        communityId,
        hasUnreadComments: undefined,
        personIds: undefined,
      },
    });
    expect(useQuery).toHaveBeenCalledWith(GET_GLOBAL_COMMUNITY_FEED, {
      variables: {},
      skip: true,
    });
  });
});

describe('renders for Unread Comments', () => {
  it('renders correctly', async () => {
    const { snapshot } = renderWithContext(
      <CommunityFeed
        communityId={communityId}
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
        communityId,
        hasUnreadComments: true,
        personIds: undefined,
      },
    });
    expect(useQuery).toHaveBeenCalledWith(GET_GLOBAL_COMMUNITY_FEED, {
      variables: {},
      skip: true,
    });
  });
});

describe('renders for Global Community', () => {
  it('renders correctly', async () => {
    const { snapshot } = renderWithContext(
      <CommunityFeed
        communityId={GLOBAL_COMMUNITY_ID}
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
      variables: { subjectType: undefined },
      skip: false,
    });
  });

  it('renders with filter correctly', async () => {
    const { snapshot } = renderWithContext(
      <CommunityFeed
        communityId={GLOBAL_COMMUNITY_ID}
        itemNamePressable={true}
        filteredFeedType={FeedItemSubjectTypeEnum.STORY}
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
        subjectType: [FeedItemSubjectTypeEnum.STORY],
      },
    });
    expect(useQuery).toHaveBeenCalledWith(GET_GLOBAL_COMMUNITY_FEED, {
      variables: { subjectType: FeedItemSubjectTypeEnum.STORY },
      skip: false,
    });
  });
});

describe('handle refreshing', () => {
  it('refreshes community feed', async () => {
    const onRefetch = jest.fn();

    const { getByType } = renderWithContext(
      <CommunityFeed
        communityId={communityId}
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
      <CommunityFeed
        communityId={GLOBAL_COMMUNITY_ID}
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
        <CommunityFeed communityId={communityId} itemNamePressable={true} />,
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
        <CommunityFeed
          communityId={GLOBAL_COMMUNITY_ID}
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
