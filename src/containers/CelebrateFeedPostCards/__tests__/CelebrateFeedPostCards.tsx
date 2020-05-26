import React from 'react';
import { MockList } from 'graphql-tools';
import { flushMicrotasksQueue, fireEvent } from 'react-native-testing-library';
import { ReactTestInstance } from 'react-test-renderer';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { navigatePush } from '../../../actions/navigation';
import { renderWithContext } from '../../../../testUtils';
import { organizationSelector } from '../../../selectors/organizations';
import { Organization } from '../../../reducers/organizations';
import {
  GET_COMMUNITY_POST_CARDS,
  MARK_COMMUNITY_FEED_ITEMS_READ,
} from '../queries';
import { FeedItemSubjectTypeEnum } from '../../../../__generated__/globalTypes';
import { CELEBRATE_FEED_WITH_TYPE_SCREEN } from '../../../containers/CelebrateFeedWithType';

import { CelebrateFeedPostCards } from '..';

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
    <CelebrateFeedPostCards
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
    <CelebrateFeedPostCards
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

describe('navs to screens', () => {
  let myGetByTestId: (testID: string) => ReactTestInstance;
  beforeEach(() => {
    const { getByTestId } = renderWithContext(
      <CelebrateFeedPostCards
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
    expect(navigatePush).toHaveBeenCalledWith(CELEBRATE_FEED_WITH_TYPE_SCREEN, {
      type,
      communityId,
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
  });
  it('navs to STEP', async () => {
    await check(FeedItemSubjectTypeEnum.STEP);
  });
  it('navs to QUESTION', async () => {
    await check(FeedItemSubjectTypeEnum.QUESTION);
  });
  it('navs to STORY', async () => {
    await check(FeedItemSubjectTypeEnum.STORY);
  });
  it('navs to HELP_REQUEST', async () => {
    await check(FeedItemSubjectTypeEnum.HELP_REQUEST);
  });
  it('navs to ANNOUNCEMENT', async () => {
    await check(FeedItemSubjectTypeEnum.ANNOUNCEMENT);
  });
});
