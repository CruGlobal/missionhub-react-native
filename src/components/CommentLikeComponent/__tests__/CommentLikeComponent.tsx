import 'react-native';
import React from 'react';
import { MockStore } from 'redux-mock-store';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { ReactTestInstance } from 'react-test-renderer';

import { renderWithContext } from '../../../../testUtils';
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { toggleLike } from '../../../actions/celebration';
import { ACTIONS } from '../../../constants';
import { trackActionWithoutData } from '../../../actions/analytics';
import {
  COMMUNITY_FEED_ITEM_FRAGMENT,
  COMMUNITY_PERSON_FRAGMENT,
} from '../../../components/CommunityFeedItem/queries';
import { CommunityPerson } from '../../CommunityFeedItem/__generated__/CommunityPerson';
import { CommunityFeedItem } from '../../CommunityFeedItem/__generated__/CommunityFeedItem';

import { CommentLikeComponent } from '..';

jest.mock('../../../actions/celebration');
jest.mock('../../../actions/analytics');

const mePerson = mockFragment<CommunityPerson>(COMMUNITY_PERSON_FRAGMENT);
const otherPerson = mockFragment<CommunityPerson>(COMMUNITY_PERSON_FRAGMENT);
const item = mockFragment<CommunityFeedItem>(COMMUNITY_FEED_ITEM_FRAGMENT);

const myId = mePerson.id;
const communityId = '567';

const toggleLikeResponse = { type: 'item was liked' };
const trackActionResponse = { type: 'tracked action' };

const initialState = { auth: { person: { id: myId } } };

let onRefresh: jest.Mock;

beforeEach(() => {
  onRefresh = jest.fn();
  (toggleLike as jest.Mock).mockReturnValue(toggleLikeResponse);
  (trackActionWithoutData as jest.Mock).mockReturnValue(trackActionResponse);
});

it('renders nothing with no subject person', () => {
  renderWithContext(
    <CommentLikeComponent
      item={{ ...item, subjectPerson: null }}
      communityId={communityId}
      onRefresh={onRefresh}
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
        item={{
          ...item,
          subjectPerson: mePerson,
        }}
        communityId={communityId}
        onRefresh={onRefresh}
      />,
      {
        initialState,
      },
    ).snapshot();
  });

  it('renders for someone else', () => {
    renderWithContext(
      <CommentLikeComponent
        item={{
          ...item,
          subjectPerson: otherPerson,
        }}
        communityId={communityId}
        onRefresh={onRefresh}
      />,
      {
        initialState,
      },
    ).snapshot();
  });

  it('renders when not liked', () => {
    renderWithContext(
      <CommentLikeComponent
        item={{
          ...item,
          subjectPerson: otherPerson,
          liked: false,
        }}
        communityId={communityId}
        onRefresh={onRefresh}
      />,
      {
        initialState,
      },
    ).snapshot();
  });

  it('renders 0 comments_count', () => {
    renderWithContext(
      <CommentLikeComponent
        item={{
          ...item,
          subjectPerson: otherPerson,
          comments: {
            ...item.comments,
            pageInfo: {
              ...item.comments.pageInfo,
              totalCount: 0,
            },
          },
        }}
        communityId={communityId}
        onRefresh={onRefresh}
      />,
      {
        initialState,
      },
    ).snapshot();
  });

  it('renders 0 likes_count', () => {
    renderWithContext(
      <CommentLikeComponent
        item={{
          ...item,
          subjectPerson: mePerson,
          likesCount: 0,
        }}
        communityId={communityId}
        onRefresh={onRefresh}
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
            item={{
              ...item,
              subjectPerson: mePerson,
              liked: false,
            }}
            communityId={communityId}
            onRefresh={onRefresh}
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

        expect(toggleLike).toHaveBeenCalledWith(item.id, false, communityId);
        expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.ITEM_LIKED);
        expect(screen.store.getActions()).toEqual([
          toggleLikeResponse,
          trackActionResponse,
        ]);
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
            item={{
              ...item,
              subjectPerson: mePerson,
              liked: true,
            }}
            communityId={communityId}
            onRefresh={onRefresh}
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

        expect(toggleLike).toHaveBeenCalledWith(item.id, true, communityId);
        expect(trackActionWithoutData).not.toHaveBeenCalled();
        expect(screen.store.getActions()).toEqual([toggleLikeResponse]);
      });
    });
  });
});
