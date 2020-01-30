import React from 'react';
import { Alert, View, AlertButton } from 'react-native';
import i18n from 'i18next';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { celebrateCommentsSelector } from '../../../selectors/celebrateComments';
import { orgPermissionSelector } from '../../../selectors/people';
import {
  reloadCelebrateComments,
  getCelebrateCommentsNextPage,
  deleteCelebrateComment,
  resetCelebrateEditingComment,
  setCelebrateEditingComment,
} from '../../../actions/celebrateComments';
import { reportComment } from '../../../actions/reportComments';
import { ORG_PERMISSIONS, CELEBRATEABLE_TYPES } from '../../../constants';
import { navigatePush } from '../../../actions/navigation';
import { Person } from '../../../reducers/people';
import { Organization } from '../../../reducers/organizations';
import { CelebrateComment } from '../../../reducers/celebrateComments';
import { GetCelebrateFeed_community_celebrationItems_nodes } from '../../../containers/CelebrateFeed/__generated__/GetCelebrateFeed';

import CommentsList from '..';

jest.mock('../../../actions/celebrateComments');
jest.mock('../../../actions/reportComments');
jest.mock('../../../actions/navigation');
jest.mock('../../../selectors/celebration');
jest.mock('../../../selectors/people');
jest.mock('../../../selectors/celebrateComments');

const me: Person = { id: '1' };
const otherPerson: Person = { id: '2' };
const organization: Organization = { id: '24234234' };
const event: GetCelebrateFeed_community_celebrationItems_nodes = {
  __typename: 'CommunityCelebrationItem',
  id: '90001',
  adjectiveAttributeName: null,
  adjectiveAttributeValue: null,
  celebrateableId: '4',
  celebrateableType: CELEBRATEABLE_TYPES.story,
  changedAttributeName: 'created_at',
  changedAttributeValue: '2004-04-04 00:00:00 UTC',
  commentsCount: 0,
  liked: false,
  likesCount: 0,
  objectDescription: null,
  subjectPerson: null,
  subjectPersonName: 'John Smith',
};
const comments: { comments: CelebrateComment[]; pagination: any } = {
  comments: [
    {
      id: '1',
      created_at: '2004-04-04 00:00:00 UTC',
      updated_at: '2004-04-04 00:00:00 UTC',
      content: 'some comment',
      person: otherPerson,
    },
    {
      id: '2',
      created_at: '2004-04-04 00:00:00 UTC',
      updated_at: '2004-04-04 00:00:00 UTC',
      content: 'some comment',
      person: otherPerson,
    },
  ],
  pagination: {},
};

const auth = { person: me };
const organizations = { all: [organization] };
const celebrateComments = { all: [comments] };

const reloadCelebrateCommentsResult = { type: 'loaded comments' };
const getCelebrateCommentsNextPageResult = { type: 'got next page' };
const deleteCelebrateCommentResult = { type: 'delete comment' };
const resetCelebrateEditingCommentResult = { type: 'reset edit comment' };
const setCelebrateEditingCommentResult = { type: 'set edit comment' };
const reportCommentResult = { type: 'report comment' };
const navigatePushResult = { type: 'navigate push' };

Alert.alert = jest.fn();

const initialState = { auth, organizations, celebrateComments };

beforeEach(() => {
  (reloadCelebrateComments as jest.Mock).mockReturnValue(
    reloadCelebrateCommentsResult,
  );
  (getCelebrateCommentsNextPage as jest.Mock).mockReturnValue(
    getCelebrateCommentsNextPageResult,
  );
  (deleteCelebrateComment as jest.Mock).mockReturnValue(
    deleteCelebrateCommentResult,
  );
  (resetCelebrateEditingComment as jest.Mock).mockReturnValue(
    resetCelebrateEditingCommentResult,
  );
  (setCelebrateEditingComment as jest.Mock).mockReturnValue(
    setCelebrateEditingCommentResult,
  );
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResult);
  (reportComment as jest.Mock).mockReturnValue(reportCommentResult);
  ((celebrateCommentsSelector as unknown) as jest.Mock).mockReturnValue(
    comments,
  );
});

describe('mounts with custom props', () => {
  it('passes in custom flatlist props', () => {
    renderWithContext(
      <CommentsList
        event={event}
        organization={organization}
        listProps={{ listHeaderComponent: () => <View /> }}
      />,
      {
        initialState,
      },
    ).snapshot();
  });
});

describe('refreshes on mount', () => {
  it('refreshes items', () => {
    const { store } = renderWithContext(
      <CommentsList event={event} organization={organization} listProps={{}} />,
      {
        initialState,
      },
    );

    expect(reloadCelebrateComments).toHaveBeenCalledWith(event);
    expect(resetCelebrateEditingComment).toHaveBeenCalledWith();
    expect(store.getActions()).toEqual([
      reloadCelebrateCommentsResult,
      resetCelebrateEditingCommentResult,
    ]);
  });
});

describe('with no comments', () => {
  beforeEach(() => {
    ((celebrateCommentsSelector as unknown) as jest.Mock).mockReturnValue(
      undefined,
    );
  });

  it('renders correctly', () => {
    renderWithContext(
      <CommentsList event={event} organization={organization} listProps={{}} />,
      {
        initialState,
      },
    ).snapshot();
  });
});

describe('with comments', () => {
  describe('with next page', () => {
    beforeEach(() =>
      ((celebrateCommentsSelector as unknown) as jest.Mock).mockReturnValue({
        ...comments,
        pagination: { hasNextPage: true },
      }),
    );

    it('renders correctly', () => {
      renderWithContext(
        <CommentsList
          event={event}
          organization={organization}
          listProps={{}}
        />,
        {
          initialState,
        },
      ).snapshot();
    });

    it('loads more comments', () => {
      const { store, getByTestId } = renderWithContext(
        <CommentsList
          event={event}
          organization={organization}
          listProps={{}}
        />,
        {
          initialState,
        },
      );

      fireEvent.press(getByTestId('LoadMore'));

      expect(getCelebrateCommentsNextPage).toHaveBeenCalledWith(event);
      expect(store.getActions()).toEqual([getCelebrateCommentsNextPageResult]);
    });
  });

  describe('without next page', () => {
    beforeEach(() =>
      ((celebrateCommentsSelector as unknown) as jest.Mock).mockReturnValue(
        comments,
      ),
    );

    it('renders correctly', () => {
      renderWithContext(
        <CommentsList
          event={event}
          organization={organization}
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
  let state: typeof initialState;
  let commentItem: any;
  let comment: CelebrateComment;
  let permission_id: string;

  const buildScreen = () => {
    ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue({
      permission_id,
    });

    state = {
      ...initialState,
      celebrateComments: {
        all: [
          {
            comments: [comment],
            pagination: {},
          },
        ],
      },
    };

    const { getByTestId } = renderWithContext(
      <CommentsList event={event} organization={organization} listProps={{}} />,
      {
        initialState: state,
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
    commentItem.props.menuActions[actionIndex].onPress(comment);
  };

  describe('author actions', () => {
    beforeEach(() => {
      comment = {
        id: 'comment1',
        created_at: '2004-04-04 00:00:00 UTC',
        updated_at: '2004-04-04 00:00:00 UTC',
        person: me,
        content: 'comment 1',
      };
      permission_id = ORG_PERMISSIONS.ADMIN;

      buildScreen();
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

      expect(setCelebrateEditingComment).toHaveBeenCalledWith(comment.id);
    });

    it('handleDelete', () => {
      Alert.alert = jest.fn(
        (_, __, c: AlertButton[] | undefined) =>
          c && c[1] && c[1].onPress && c[1].onPress(),
      );

      testFireAction(1);

      expect(deleteCelebrateComment).toHaveBeenCalledWith(
        organization.id,
        event,
        comment,
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
      comment = {
        id: 'comment1',
        person: otherPerson,
        created_at: '2004-04-04 00:00:00 UTC',
        updated_at: '2004-04-04 00:00:00 UTC',
        content: 'comment 1',
      };
      permission_id = ORG_PERMISSIONS.OWNER;

      buildScreen();
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

      expect(deleteCelebrateComment).toHaveBeenCalledWith(
        organization.id,
        event,
        comment,
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
      comment = {
        id: 'comment1',
        person: otherPerson,
        created_at: '2004-04-04 00:00:00 UTC',
        updated_at: '2004-04-04 00:00:00 UTC',
        content: 'comment 1',
      };
      permission_id = ORG_PERMISSIONS.USER;

      buildScreen();
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

      expect(reportComment).toHaveBeenCalledWith(organization.id, comment);
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
