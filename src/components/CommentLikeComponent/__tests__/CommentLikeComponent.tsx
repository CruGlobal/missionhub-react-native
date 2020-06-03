import 'react-native';
import React from 'react';
import { MockStore } from 'redux-mock-store';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { ReactTestInstance } from 'react-test-renderer';
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

import { CommentLikeComponent } from '..';

jest.mock('../../../actions/celebration');
jest.mock('../../../actions/analytics');

const trackActionResponse = { type: 'tracked action' };

const myId = '1';
const feedItemId = '12';
const initialState = { auth: { person: { id: myId } } };

beforeEach(() => {
  (trackActionWithoutData as jest.Mock).mockReturnValue(trackActionResponse);
});

it('renders nothing with no subject person', () => {
  renderWithContext(
    <CommentLikeComponent
      feedItem={mockFragment<CommunityFeedItemCommentLike>(
        COMMUNITY_FEED_ITEM_COMMENT_LIKE_FRAGMENT,
        { mocks: { FeedItem: () => ({ subjectPerson: null }) } },
      )}
    />,
    {
      initialState,
    },
  ).snapshot();
});

describe('with subject person', () => {
  it('renders for me', () => {
    renderWithContext(
      <CommentLikeComponent
        feedItem={mockFragment<CommunityFeedItemCommentLike>(
          COMMUNITY_FEED_ITEM_COMMENT_LIKE_FRAGMENT,
          { mocks: { FeedItem: () => ({ subjectPerson: { id: myId } }) } },
        )}
      />,
      {
        initialState,
      },
    ).snapshot();
  });

  it('renders for someone else', () => {
    renderWithContext(
      <CommentLikeComponent
        feedItem={mockFragment<CommunityFeedItemCommentLike>(
          COMMUNITY_FEED_ITEM_COMMENT_LIKE_FRAGMENT,
        )}
      />,
      {
        initialState,
      },
    ).snapshot();
  });

  it('renders when not liked', () => {
    renderWithContext(
      <CommentLikeComponent
        feedItem={mockFragment<CommunityFeedItemCommentLike>(
          COMMUNITY_FEED_ITEM_COMMENT_LIKE_FRAGMENT,
          { mocks: { FeedItem: () => ({ liked: false }) } },
        )}
      />,
      {
        initialState,
      },
    ).snapshot();
  });

  it('renders 0 comments_count', () => {
    renderWithContext(
      <CommentLikeComponent
        feedItem={mockFragment<CommunityFeedItemCommentLike>(
          COMMUNITY_FEED_ITEM_COMMENT_LIKE_FRAGMENT,
          { mocks: { BasePageInfo: () => ({ totalCount: 0 }) } },
        )}
      />,
      {
        initialState,
      },
    ).snapshot();
  });

  it('renders 0 likes_count', () => {
    renderWithContext(
      <CommentLikeComponent
        feedItem={mockFragment<CommunityFeedItemCommentLike>(
          COMMUNITY_FEED_ITEM_COMMENT_LIKE_FRAGMENT,
          {
            mocks: {
              FeedItem: () => ({ subjectPerson: { id: myId }, likesCount: 0 }),
            },
          },
        )}
      />,
      {
        initialState,
      },
    ).snapshot();
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
        screen = renderWithContext(
          <CommentLikeComponent
            feedItem={mockFragment<CommunityFeedItemCommentLike>(
              COMMUNITY_FEED_ITEM_COMMENT_LIKE_FRAGMENT,
              {
                mocks: {
                  FeedItem: () => ({
                    id: feedItemId,
                    subjectPerson: { id: myId },
                    liked: false,
                  }),
                },
              },
            )}
          />,
          {
            initialState,
          },
        );
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
        screen = renderWithContext(
          <CommentLikeComponent
            feedItem={mockFragment<CommunityFeedItemCommentLike>(
              COMMUNITY_FEED_ITEM_COMMENT_LIKE_FRAGMENT,
              {
                mocks: {
                  FeedItem: () => ({
                    id: feedItemId,
                    subjectPerson: { id: myId },
                    liked: true,
                  }),
                },
              },
            )}
          />,
          {
            initialState,
          },
        );
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
});
