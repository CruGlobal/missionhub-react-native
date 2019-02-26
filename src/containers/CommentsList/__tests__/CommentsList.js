import 'react-native';
import React from 'react';
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
} from '../../../actions/celebrateComments';
import * as common from '../../../utils/common';
import { ORG_PERMISSIONS } from '../../../constants';

jest.mock('../../../actions/celebrateComments');
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

let screen;

reloadCelebrateComments.mockReturnValue(dispatch =>
  dispatch(reloadCelebrateCommentsResult),
);
getCelebrateCommentsNextPage.mockReturnValue(dispatch =>
  dispatch(getCelebrateCommentsNextPageResult),
);

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

describe('comments sets up actions as author', () => {
  it('handleLongPress', () => {
    common.showMenu = jest.fn();
    const person = { id: '1' };
    const comment = { id: 'comment1', person };
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
    orgPermissionSelector.mockReturnValue({
      permission_id: ORG_PERMISSIONS.ADMIN,
    });

    screen.instance().handleLongPress(comment, 'testRef');
    expect(common.showMenu).toHaveBeenCalledWith(
      [
        {
          text: i18n.t('edit'),
          onPress: expect.any(Function),
        },
        {
          text: i18n.t('delete'),
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
    common.showMenu = jest.fn();
    const person = { id: '2' };
    const comment = { id: 'comment1', person };
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
    orgPermissionSelector.mockReturnValue({
      permission_id: ORG_PERMISSIONS.ADMIN,
    });

    screen.instance().handleLongPress(comment, 'testRef');
    expect(common.showMenu).toHaveBeenCalledWith(
      [
        {
          text: i18n.t('delete'),
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
    common.showMenu = jest.fn();
    const person = { id: '2' };
    const comment = { id: 'comment1', person };
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
    orgPermissionSelector.mockReturnValue({
      permission_id: ORG_PERMISSIONS.USER,
    });

    screen.instance().handleLongPress(comment, 'testRef');
    expect(common.showMenu).toHaveBeenCalledWith(
      [
        {
          text: i18n.t('report'),
          onPress: expect.any(Function),
          destructive: true,
        },
      ],
      'testRef',
    );
  });
});
