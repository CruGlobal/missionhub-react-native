import 'react-native';
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import CommentsList from '..';

import { renderShallow } from '../../../../testUtils';
import { celebrateCommentsSelector } from '../../../selectors/celebrateComments';
import {
  reloadCelebrateComments,
  getCelebrateCommentsNextPage,
} from '../../../actions/celebrateComments';

jest.mock('../../../actions/celebrateComments');
jest.mock('../../../selectors/celebration');
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

beforeEach(() => {
  jest.clearAllMocks();

  store = mockStore({
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
