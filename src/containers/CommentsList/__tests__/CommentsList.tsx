/* eslint max-lines: 0 */
import React from 'react';
import { Alert, View, AlertButton } from 'react-native';
import i18n from 'i18next';
import { ReactTestInstance } from 'react-test-renderer';
import { useMutation } from '@apollo/react-hooks';

import { renderWithContext } from '../../../../testUtils';
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { orgPermissionSelector } from '../../../selectors/people';
import { navigatePush } from '../../../actions/navigation';
import { Person } from '../../../reducers/people';
import { Organization } from '../../../reducers/organizations';
import { FeedItemCommentItem } from '../../CommentItem/__generated__/FeedItemCommentItem';
import { FEED_ITEM_COMMENT_ITEM_FRAGMENT } from '../../CommentItem/queries';
import {
  REPORT_FEED_ITEM_COMMENT_MUTATION,
  DELETE_FEED_ITEM_COMMENT_MUTATION,
} from '../queries';

import CommentsList from '..';

jest.mock('../../../actions/navigation');
jest.mock('../../../selectors/people');

const myId = '1';
const me: Person = { id: myId, first_name: 'Matt', last_name: 'Smith' };
const organization: Organization = { id: '24234234' };
const feedItemId = '1';
const comments = [
  mockFragment<FeedItemCommentItem>(FEED_ITEM_COMMENT_ITEM_FRAGMENT),
  mockFragment<FeedItemCommentItem>(FEED_ITEM_COMMENT_ITEM_FRAGMENT),
];
const myComment = mockFragment<FeedItemCommentItem>(
  FEED_ITEM_COMMENT_ITEM_FRAGMENT,
  {
    mocks: { Person: () => ({ id: myId }) },
  },
);
const setEditingCommentId = jest.fn();

const auth = { person: me };
const organizations = { all: [organization] };
const celebrateComments = { all: [comments] };

const navigatePushResult = { type: 'navigate push' };

Alert.alert = jest.fn();

const initialState = { auth, organizations, celebrateComments };

beforeEach(() => {
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResult);
});

describe('mounts with custom props', () => {
  it('passes in custom flatlist props', () => {
    renderWithContext(
      <CommentsList
        feedItemId={feedItemId}
        comments={comments}
        setEditingCommentId={setEditingCommentId}
        isOwner={false}
        listProps={{ listHeaderComponent: () => <View /> }}
      />,
      {
        initialState,
      },
    ).snapshot();
  });
});

describe('with no comments', () => {
  it('renders correctly', () => {
    renderWithContext(
      <CommentsList
        feedItemId={feedItemId}
        comments={[]}
        setEditingCommentId={setEditingCommentId}
        isOwner={false}
        listProps={{}}
      />,
      {
        initialState,
      },
    ).snapshot();
  });
});

describe('with comments', () => {
  describe('with next page', () => {
    it('renders correctly', () => {
      renderWithContext(
        <CommentsList
          feedItemId={feedItemId}
          comments={comments}
          setEditingCommentId={setEditingCommentId}
          isOwner={false}
          listProps={{}}
        />,
        {
          initialState,
        },
      ).snapshot();
    });

    describe('without next page', () => {
      it('renders correctly', () => {
        renderWithContext(
          <CommentsList
            feedItemId={feedItemId}
            comments={comments}
            setEditingCommentId={setEditingCommentId}
            isOwner={false}
            listProps={{}}
          />,
          {
            initialState,
          },
        ).snapshot();
      });
    });
  });

  describe('determine comment menu actions', () => {
    let commentItem: ReactTestInstance;
    let permission_id: string;

    const buildScreen = (comment: FeedItemCommentItem, isOwner = false) => {
      ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue({
        permission_id,
      });

      const { getByTestId } = renderWithContext(
        <CommentsList
          feedItemId={feedItemId}
          comments={[comment]}
          setEditingCommentId={setEditingCommentId}
          isOwner={isOwner}
          listProps={{}}
        />,
        {
          initialState,
        },
      );

      commentItem = getByTestId('CommentItem');
    };

    const testActionArray = (
      expectedActions: {
        text: string;
        onPress: () => void;
        destructive?: boolean;
      }[],
    ) => {
      expect(commentItem.props.menuActions).toEqual(expectedActions);
    };

    const testFireAction = (actionIndex: number) => {
      commentItem.props.menuActions[actionIndex].onPress(comments[0]);
    };

    describe('author actions', () => {
      beforeEach(() => {
        buildScreen(myComment);
      });

      it('creates array', () => {
        testActionArray([
          {
            text: i18n.t('commentsList:editPost'),
            onPress: expect.any(Function),
          },
          {
            text: i18n.t('commentsList:deletePost'),
            onPress: expect.any(Function),
            destructive: true,
          },
        ]);
      });

      it('handleEdit', () => {
        testFireAction(0);
        expect(setEditingCommentId).toHaveBeenCalledWith(myComment.id);
      });

      it('handleDelete', () => {
        Alert.alert = jest.fn(
          (_, __, c: AlertButton[] | undefined) =>
            c && c[1] && c[1].onPress && c[1].onPress(),
        );

        testFireAction(1);

        expect(useMutation).toHaveBeenMutatedWith(
          DELETE_FEED_ITEM_COMMENT_MUTATION,
          {
            variables: { id: myComment.id },
          },
        );
        expect(Alert.alert).toHaveBeenCalledWith(
          i18n.t('commentsList:deletePostHeader'),
          i18n.t('commentsList:deleteAreYouSure'),
          [
            {
              text: i18n.t('cancel'),
              style: 'cancel',
            },
            {
              text: i18n.t('commentsList:deletePost'),
              onPress: expect.any(Function),
            },
          ],
        );
      });
    });

    describe('owner actions', () => {
      beforeEach(() => {
        buildScreen(comments[0], true);
      });

      it('creates array', () => {
        testActionArray([
          {
            text: i18n.t('commentsList:deletePost'),
            onPress: expect.any(Function),
            destructive: true,
          },
        ]);
      });

      it('handleDelete', () => {
        Alert.alert = jest.fn(
          (_, __, c: AlertButton[] | undefined) =>
            c && c[1] && c[1].onPress && c[1].onPress(),
        );

        testFireAction(0);

        expect(useMutation).toHaveBeenMutatedWith(
          DELETE_FEED_ITEM_COMMENT_MUTATION,
          {
            variables: { id: comments[0].id },
          },
        );
        expect(Alert.alert).toHaveBeenCalledWith(
          i18n.t('commentsList:deletePostHeader'),
          i18n.t('commentsList:deleteAreYouSure'),
          [
            {
              text: i18n.t('cancel'),
              style: 'cancel',
            },
            {
              text: i18n.t('commentsList:deletePost'),
              onPress: expect.any(Function),
            },
          ],
        );
      });
    });

    describe('user actions', () => {
      beforeEach(() => {
        buildScreen(comments[0]);
      });

      it('creates array', () => {
        testActionArray([
          {
            text: i18n.t('commentsList:reportToOwner'),
            onPress: expect.any(Function),
          },
        ]);
      });

      it('handleReport', () => {
        Alert.alert = jest.fn(
          (_, __, c: AlertButton[] | undefined) =>
            c && c[1] && c[1].onPress && c[1].onPress(),
        );

        testFireAction(0);

        expect(useMutation).toHaveBeenMutatedWith(
          REPORT_FEED_ITEM_COMMENT_MUTATION,
          {
            variables: { id: comments[0].id },
          },
        );
        expect(Alert.alert).toHaveBeenCalledWith(
          i18n.t('commentsList:reportToOwnerHeader'),
          i18n.t('commentsList:reportAreYouSure'),
          [
            {
              text: i18n.t('cancel'),
              style: 'cancel',
            },
            {
              text: i18n.t('commentsList:reportPost'),
              onPress: expect.any(Function),
            },
          ],
        );
      });
    });
  });
});
