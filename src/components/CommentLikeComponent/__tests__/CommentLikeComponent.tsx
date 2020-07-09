import 'react-native';
import React from 'react';
import { MockStore } from 'redux-mock-store';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { ReactTestInstance } from 'react-test-renderer';
import { IMocks } from 'graphql-tools';
import { useMutation } from '@apollo/react-hooks';

import { renderWithContext } from '../../../../testUtils';
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { ACTIONS } from '../../../constants';
import { trackActionWithoutData } from '../../../actions/analytics';
import {
  COMMUNITY_FEED_ITEM_COMMENT_LIKE_FRAGMENT,
  SET_FEED_ITEM_LIKE_MUTATION,
} from '../queries';
import { CommunityFeedItemCommentLike } from '../__generated__/CommunityFeedItemCommentLike';
import { navigatePush } from '../../../actions/navigation';
import { FEED_ITEM_DETAIL_SCREEN } from '../../../containers/Communities/Community/CommunityFeedTab/FeedItemDetailScreen/FeedItemDetailScreen';
import { PostTypeEnum } from '../../../../__generated__/globalTypes';

import { CommentLikeComponent } from '..';

jest.mock('../../../actions/celebration');
jest.mock('../../../actions/analytics');
jest.mock('../../../actions/navigation', () => ({
  navigatePush: jest.fn().mockReturnValue({ type: 'navigatePush' }),
}));

const trackActionResponse = { type: 'tracked action' };

const myId = '1';
const feedItemId = '12';
const initialState = { auth: { person: { id: myId } } };

beforeEach(() => {
  (trackActionWithoutData as jest.Mock).mockReturnValue(trackActionResponse);
});

function render(mocks?: IMocks) {
  return renderWithContext(
    <CommentLikeComponent
      feedItem={mockFragment<CommunityFeedItemCommentLike>(
        COMMUNITY_FEED_ITEM_COMMENT_LIKE_FRAGMENT,
        mocks ? { mocks } : undefined,
      )}
    />,
    { initialState },
  );
}

it('renders nothing with no subject person', () => {
  render({ FeedItem: () => ({ subjectPerson: null }) }).snapshot();
});

describe('with subject person', () => {
  it('renders for me', () => {
    render({ FeedItem: () => ({ subjectPerson: { id: myId } }) }).snapshot();
  });

  it('renders for someone else', () => {
    render().snapshot();
  });

  it('renders prayer request liked', () => {
    render({
      FeedItem: () => ({
        subject: {
          __typename: 'Post',
          postType: PostTypeEnum.prayer_request,
        },
        liked: true,
      }),
    }).snapshot();
  });

  it('renders prayer request not liked', () => {
    render({
      FeedItem: () => ({
        subject: {
          __typename: 'Post',
          postType: PostTypeEnum.prayer_request,
        },
        liked: false,
      }),
    }).snapshot();
  });

  it('renders when not liked', () => {
    render({ FeedItem: () => ({ liked: false }) }).snapshot();
  });

  it('renders 0 comments_count', () => {
    render({ BasePageInfo: () => ({ totalCount: 0 }) }).snapshot();
  });

  it('renders 0 likes_count', () => {
    render({
      FeedItem: () => ({ subjectPerson: { id: myId }, likesCount: 0 }),
    }).snapshot();
  });

  describe('onPress like button', () => {
    describe('unlike -> like', () => {
      let screen: {
        store: MockStore;
        recordSnapshot: () => void;
        diffSnapshot: () => void;
        getByTestId: (id: string) => ReactTestInstance;
      };

      beforeEach(() => {
        screen = render({
          FeedItem: () => ({
            id: feedItemId,
            subjectPerson: { id: myId },
            liked: false,
          }),
        });
      });

      it('renders disabled heart button', async () => {
        screen.recordSnapshot();

        fireEvent.press(screen.getByTestId('LikeIconButton'));

        screen.diffSnapshot();

        await flushMicrotasksQueue();
      });

      it('toggles like', async () => {
        await fireEvent.press(screen.getByTestId('LikeIconButton'));

        expect(useMutation).toHaveBeenCalledWith(SET_FEED_ITEM_LIKE_MUTATION, {
          variables: { id: feedItemId, liked: true },
        });
        expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.ITEM_LIKED);
        expect(screen.store.getActions()).toEqual([trackActionResponse]);
      });
    });

    describe('like -> unlike', () => {
      let screen: {
        store: MockStore;
        recordSnapshot: () => void;
        diffSnapshot: () => void;
        getByTestId: (id: string) => ReactTestInstance;
      };

      beforeEach(() => {
        screen = render({
          FeedItem: () => ({
            id: feedItemId,
            subjectPerson: { id: myId },
            liked: true,
          }),
        });
      });

      it('renders disabled heart button', async () => {
        screen.recordSnapshot();

        fireEvent.press(screen.getByTestId('LikeIconButton'));

        screen.diffSnapshot();

        await flushMicrotasksQueue();
      });

      it('toggles like', async () => {
        await fireEvent.press(screen.getByTestId('LikeIconButton'));

        expect(useMutation).toHaveBeenCalledWith(SET_FEED_ITEM_LIKE_MUTATION, {
          variables: { id: feedItemId, liked: false },
        });
        expect(trackActionWithoutData).not.toHaveBeenCalled();
      });
    });
  });

  it('onPress comment button', () => {
    const { getByTestId } = render({
      FeedItem: () => ({
        id: feedItemId,
      }),
    });

    fireEvent.press(getByTestId('CommentIconButton'));

    expect(navigatePush).toHaveBeenCalledWith(FEED_ITEM_DETAIL_SCREEN, {
      feedItemId,
    });
  });

  it('onPress comment button with onCommentPress', () => {
    const onCommentPress = jest.fn();
    const { getByTestId } = renderWithContext(
      <CommentLikeComponent
        onCommentPress={onCommentPress}
        feedItem={mockFragment(COMMUNITY_FEED_ITEM_COMMENT_LIKE_FRAGMENT, {
          mocks: {
            FeedItem: () => ({
              id: feedItemId,
            }),
          },
        })}
      />,
      { initialState },
    );

    fireEvent.press(getByTestId('CommentIconButton'));

    expect(onCommentPress).toHaveBeenCalledWith();
  });
});
