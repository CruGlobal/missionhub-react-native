import React from 'react';
import { Alert } from 'react-native';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import i18n from 'i18next';

import CommentsList from '..';

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
import * as common from '../../../utils/common';
import { ORG_PERMISSIONS } from '../../../constants';
import { navigatePush } from '../../../actions/navigation';

jest.mock('../../../actions/celebrateComments');
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
const setCelebrateEditingCommentResult = { type: 'reset edit comment' };
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
Alert.alert = jest.fn();

const me = { id: '1' };

beforeEach(() => {
  jest.clearAllMocks();

  store = mockStore({
    auth: { person: me },
    organizations,
    celebrateComments: celebrateCommentsState,
  });

  screen = renderShallow(
    <CommentsList event={event} organizationId={organizationId} />,
    store,
  );
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
      }));

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
      celebrateCommentsSelector.mockReturnValue(celebrateComments));

    it('renders correctly', () => {
      expect(screen).toMatchSnapshot();
    });
  });
});

function buildScreenWithComment(comment) {
  common.showMenu = jest.fn();
  store = mockStore({
    auth: { person: me },
    organizations,
    celebrateComments: {
      comments: [comment],
      pagination: {},
    },
  });

  screen = renderShallow(
    <CommentsList event={event} organizationId={organizationId} />,
    store,
  );
}

describe('comments sets up actions as author', () => {
  it('handleLongPress', () => {
    const person = { id: '1' };
    const comment = { id: 'comment1', person };

    orgPermissionSelector.mockReturnValue({
      permission_id: ORG_PERMISSIONS.ADMIN,
    });
    buildScreenWithComment(comment);

    screen.instance().handleLongPress(comment, 'testRef');
    expect(common.showMenu).toHaveBeenCalledWith(
      [
        {
          text: i18n.t('commentsList:editPost'),
          onPress: expect.any(Function),
        },
        {
          text: i18n.t('commentsList:deletePost'),
          onPress: expect.any(Function),
          destructive: true,
        },
      ],
      'testRef',
    );
  });
});

describe('comments sets up actions as owner', () => {
  it('handleLongPress', () => {
    const person = { id: '2' };
    const comment = { id: 'comment1', person };
    buildScreenWithComment(comment);

    orgPermissionSelector.mockReturnValue({
      permission_id: ORG_PERMISSIONS.ADMIN,
    });

    screen.instance().handleLongPress(comment, 'testRef');
    expect(common.showMenu).toHaveBeenCalledWith(
      [
        {
          text: i18n.t('commentsList:deletePost'),
          onPress: expect.any(Function),
          destructive: true,
        },
      ],
      'testRef',
    );
  });
});

describe('comments sets up actions as user', () => {
  it('handleLongPress', () => {
    const person = { id: '2' };
    const comment = { id: 'comment1', person };
    buildScreenWithComment(comment);

    orgPermissionSelector.mockReturnValue({
      permission_id: ORG_PERMISSIONS.USER,
    });

    const instance = screen.instance();
    instance.handleReport = jest.fn();

    instance.handleLongPress(comment, 'testRef');
    expect(common.showMenu).toHaveBeenCalledWith(
      [
        {
          text: i18n.t('commentsList:reportToOwner'),
          onPress: expect.any(Function),
        },
      ],
      'testRef',
    );
  });
});

describe('comment action for author', () => {
  let instance;
  const person = { id: '1' };
  const comment = { id: 'comment1', person };
  beforeEach(() => {
    buildScreenWithComment(comment);

    orgPermissionSelector.mockReturnValue({
      permission_id: ORG_PERMISSIONS.ADMIN,
    });

    instance = screen.instance();
  });
  it('handleEdit', () => {
    common.showMenu = jest.fn(a => a[0].onPress());
    instance.handleLongPress(comment, 'testRef');
    expect(setCelebrateEditingComment).toHaveBeenCalledWith(comment.id);
  });
  it('handleDelete', () => {
    Alert.alert = jest.fn((a, b, c) => c[1].onPress());
    common.showMenu = jest.fn(a => a[1].onPress());
    instance.handleLongPress(comment, 'testRef');
    expect(deleteCelebrateComment).toHaveBeenCalledWith(event, comment);
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

describe('comment action for user', () => {
  let instance;
  const person = { id: '2' };
  const comment = { id: 'comment1', person };
  beforeEach(() => {
    buildScreenWithComment(comment);

    orgPermissionSelector.mockReturnValue({
      permission_id: ORG_PERMISSIONS.USER,
    });

    instance = screen.instance();
  });
  it('handleReport', () => {
    Alert.alert = jest.fn((a, b, c) => c[1].onPress());
    common.showMenu = jest.fn(a => a[0].onPress());
    instance.handleLongPress(comment, 'testRef');
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
