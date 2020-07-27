import React from 'react';
import { MockList } from 'graphql-tools';
import { flushMicrotasksQueue, fireEvent } from 'react-native-testing-library';
import { ReactTestInstance } from 'react-test-renderer';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { navigatePush } from '../../../actions/navigation';
import { renderWithContext } from '../../../../testUtils';
import {
  GET_COMMUNITY_POST_CARDS,
  MARK_COMMUNITY_FEED_ITEMS_READ,
} from '../queries';
import { FeedItemSubjectTypeEnum } from '../../../../__generated__/globalTypes';
import { COMMUNITY_FEED_WITH_TYPE_SCREEN } from '../../../containers/CommunityFeedWithType';
import { GLOBAL_COMMUNITY_ID } from '../../../constants';
import { CommunityFeedPostCards } from '..';

jest.mock('../../../actions/navigation', () => ({
  navigatePush: jest.fn(() => ({ type: 'navigatePush' })),
}));
jest.mock('../../../selectors/organizations');
jest.mock('../../../components/PostTypeLabel', () => ({
  PostTypeCardWithPeople: 'PostTypeCardWithPeople',
}));

const myId = '123';
const communityId = '456';
const mockFeedRefetch = jest.fn();

const initialState = {
  auth: { person: { id: myId } },
};

it('renders empty correctly', () => {
  renderWithContext(
    <CommunityFeedPostCards
      communityId={communityId}
      feedRefetch={mockFeedRefetch}
    />,
    {
      initialState,
      mocks: { FeedItemConnection: () => ({ nodes: () => new MockList(0) }) },
    },
  ).snapshot();
});

it('renders with feed items correctly', async () => {
  const { snapshot } = renderWithContext(
    <CommunityFeedPostCards
      communityId={communityId}
      feedRefetch={mockFeedRefetch}
    />,
    {
      initialState,
      mocks: { FeedItemConnection: () => ({ nodes: () => new MockList(10) }) },
    },
  );

  await flushMicrotasksQueue();
  snapshot();

  expect(useQuery).toHaveBeenCalledWith(GET_COMMUNITY_POST_CARDS, {
    variables: { communityId },
  });
});

it('renders with global feed items correctly', async () => {
  const { snapshot } = renderWithContext(
    <CommunityFeedPostCards
      communityId={GLOBAL_COMMUNITY_ID}
      feedRefetch={mockFeedRefetch}
    />,
    {
      initialState,
      mocks: { FeedItemConnection: () => ({ nodes: () => new MockList(10) }) },
    },
  );

  await flushMicrotasksQueue();
  snapshot();

  expect(useQuery).toHaveBeenCalledWith(GET_COMMUNITY_POST_CARDS, {
    variables: { communityId: GLOBAL_COMMUNITY_ID },
  });
});

describe('navs to screens', () => {
  let myGetByTestId: (testID: string) => ReactTestInstance;
  beforeEach(() => {
    const { getByTestId } = renderWithContext(
      <CommunityFeedPostCards
        communityId={communityId}
        feedRefetch={mockFeedRefetch}
      />,
      {
        initialState,
        mocks: {
          FeedItemConnection: () => ({ nodes: () => new MockList(1) }),
        },
      },
    );
    myGetByTestId = getByTestId;
  });
  async function check(type: FeedItemSubjectTypeEnum) {
    await flushMicrotasksQueue();
    await fireEvent.press(myGetByTestId(`PostCard_${type}`));
    expect(navigatePush).toHaveBeenCalledWith(COMMUNITY_FEED_WITH_TYPE_SCREEN, {
      type,
      communityId,
      communityName: expect.any(String),
    });
    expect(useMutation).toHaveBeenMutatedWith(MARK_COMMUNITY_FEED_ITEMS_READ, {
      variables: {
        input: {
          communityId,
          feedItemSubjectType: type,
        },
      },
    });
    expect(mockFeedRefetch).toHaveBeenCalled();
  }
  it('navs to PRAYER_REQUEST', async () => {
    await check(FeedItemSubjectTypeEnum.PRAYER_REQUEST);
    expect.hasAssertions();
  });
  it('navs to STEP', async () => {
    await check(FeedItemSubjectTypeEnum.STEP);
    expect.hasAssertions();
  });
  it('navs to QUESTION', async () => {
    await check(FeedItemSubjectTypeEnum.QUESTION);
    expect.hasAssertions();
  });
  it('navs to STORY', async () => {
    await check(FeedItemSubjectTypeEnum.STORY);
    expect.hasAssertions();
  });
  it('navs to HELP_REQUEST', async () => {
    await check(FeedItemSubjectTypeEnum.HELP_REQUEST);
    expect.hasAssertions();
  });
  it('navs to ANNOUNCEMENT', async () => {
    await check(FeedItemSubjectTypeEnum.ANNOUNCEMENT);
    expect.hasAssertions();
  });
});
