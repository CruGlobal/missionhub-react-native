import React from 'react';
import { Alert } from 'react-native';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import i18n from 'i18next';

import { renderShallow } from '../../../../testUtils';
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
import { ORG_PERMISSIONS } from '../../../constants';
import { navigatePush } from '../../../actions/navigation';
import Text from '../../../components/Text';

import CommentsList from '..';

jest.mock('../../../actions/celebrateComments');
jest.mock('../../../actions/reportComments');
jest.mock('../../../actions/navigation');
jest.mock('../../../selectors/celebration');
jest.mock('../../../selectors/people');
jest.mock('../../../selectors/celebrateComments');

const mockStore = configureStore([thunk]);
let store;

const organizationId = '24234234';
const event = { id: '90001', organization: { id: organizationId } };
const celebrateComments = {
  comments: [{ content: 'some comment' }, { content: 'another comment' }],
  pagination: {},
};

const organizations = [event.organization];
const celebrateCommentsState = [celebrateComments];
const reloadCelebrateCommentsResult = { type: 'loaded comments' };
const getCelebrateCommentsNextPageResult = { type: 'got next page' };
const deleteCelebrateCommentResult = { type: 'delete comment' };
const resetCelebrateEditingCommentResult = { type: 'reset edit comment' };
const setCelebrateEditingCommentResult = { type: 'set edit comment' };
const reportCommentResult = { type: 'report comment' };
const navigatePushResult = { type: 'navigate push' };

let screen;

reloadCelebrateComments.mockReturnValue(dispatch =>
  dispatch(reloadCelebrateCommentsResult),
);
getCelebrateCommentsNextPage.mockReturnValue(dispatch =>
  dispatch(getCelebrateCommentsNextPageResult),
);
deleteCelebrateComment.mockReturnValue(dispatch =>
  dispatch(deleteCelebrateCommentResult),
);
resetCelebrateEditingComment.mockReturnValue(dispatch =>
  dispatch(resetCelebrateEditingCommentResult),
);
setCelebrateEditingComment.mockReturnValue(dispatch =>
  dispatch(setCelebrateEditingCommentResult),
);
navigatePush.mockReturnValue(dispatch => dispatch(navigatePushResult));
reportComment.mockReturnValue(dispatch => dispatch(reportCommentResult));
Alert.alert = jest.fn();

const me = { id: '1' };
const otherPerson = { id: '2' };

beforeEach(() => {
  store = mockStore({
    auth: { person: me },
    organizations,
    celebrateComments: celebrateCommentsState,
  });

  screen = renderShallow(<CommentsList event={event} />, store);
});

describe('mounts with custom props', () => {
  it('passes in custom flatlist props', () => {
    screen = renderShallow(
      <CommentsList
        event={event}
        listProps={{ ListHeaderComponent: () => <Text>Test</Text> }}
      />,
      store,
    );
    expect(screen).toMatchSnapshot();
  });
});

describe('componentDidMount', () => {
  it('refreshes items', () => {
    expect(reloadCelebrateComments).toHaveBeenCalledWith(event);
    expect(store.getActions()).toEqual(
      expect.arrayContaining([reloadCelebrateCommentsResult]),
    );
  });
});

describe('with no comments', () => {
  beforeAll(() => celebrateCommentsSelector.mockReturnValue(undefined));

  it('renders correctly', () => {
    expect(screen).toMatchSnapshot();
  });
});

describe('with comments', () => {
  describe('with next page', () => {
    beforeAll(() =>
      celebrateCommentsSelector.mockReturnValue({
        ...celebrateComments,
        pagination: { hasNextPage: true },
      }),
    );

    it('renders correctly', () => {
      expect(screen).toMatchSnapshot();
    });

    it('renders item correctly', () => {
      expect(
        screen.props().renderItem({
          item: {
            content: 'hello roge',
            person: { id: '1' },
          },
        }),
      ).toMatchSnapshot();
    });

    it('loads more comments', () => {
      screen.props().ListFooterComponent.props.onPress();

      expect(getCelebrateCommentsNextPage).toHaveBeenCalledWith(event);
      expect(store.getActions()).toEqual(
        expect.arrayContaining([getCelebrateCommentsNextPageResult]),
      );
    });
  });

  describe('without next page', () => {
    beforeAll(() =>
      celebrateCommentsSelector.mockReturnValue(celebrateComments),
    );

    it('renders correctly', () => {
      expect(screen).toMatchSnapshot();
    });
  });
});

describe('determine comment menu actions', () => {
  let screen;
  let comment;
  let permission_id;

  const buildScreenWithComment = () => {
    orgPermissionSelector.mockReturnValue({ permission_id });

    store = mockStore({
      auth: { person: me },
      organizations,
      celebrateComments: {
        comments: [comment],
        pagination: {},
      },
    });

    screen = renderShallow(<CommentsList event={event} />, store);
  };

  const testActionArray = expectedActions => {
    expect(
      screen.props().renderItem({ item: comment }).props.menuActions,
    ).toEqual(expectedActions);
  };

  const testFireAction = actionIndex => {
    screen
      .props()
      .renderItem({ item: comment })
      .props.menuActions[actionIndex].onPress(comment);
  };

  describe('author actions', () => {
    beforeEach(() => {
      comment = { id: 'comment1', person: me };
      permission_id = ORG_PERMISSIONS.ADMIN;
      buildScreenWithComment();
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
      Alert.alert = jest.fn((a, b, c) => c[1].onPress());

      testFireAction(1);

      expect(deleteCelebrateComment).toHaveBeenCalledWith(
        organizationId,
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
      comment = { id: 'comment1', person: otherPerson };
      permission_id = ORG_PERMISSIONS.OWNER;
      buildScreenWithComment();
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
      Alert.alert = jest.fn((a, b, c) => c[1].onPress());

      testFireAction(0);

      expect(deleteCelebrateComment).toHaveBeenCalledWith(
        organizationId,
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
      comment = { id: 'comment1', person: otherPerson };
      permission_id = ORG_PERMISSIONS.USER;
      buildScreenWithComment();
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
      Alert.alert = jest.fn((a, b, c) => c[1].onPress());

      testFireAction(0);

      expect(reportComment).toHaveBeenCalledWith(organizationId, comment);
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
