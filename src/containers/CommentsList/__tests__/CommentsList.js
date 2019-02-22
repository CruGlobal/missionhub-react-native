import 'react-native';
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import CommentsList from '..';

import { renderShallow } from '../../../../testUtils';
import { celebrationItemSelector } from '../../../selectors/celebration';
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

celebrationItemSelector.mockReturnValue(event);
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
});

function subject() {
  return renderShallow(
    <CommentsList eventId={event.id} organizationId={organizationId} />,
    store,
  );
}

describe('componentDidMount', () => {
  it('refreshes items', () => {
    subject();

    expect(reloadCelebrateComments).toHaveBeenCalledWith(event);
    expect(store.getActions()).toEqual(
      expect.arrayContaining([reloadCelebrateCommentsResult]),
    );
  });
});

describe('with no comments', () => {
  beforeEach(() => celebrateCommentsSelector.mockReturnValue(undefined));

  it('renders correctly', () => {
    expect(subject()).toMatchSnapshot();
  });
});

describe('with comments', () => {
  describe('with next page', () => {
    beforeEach(() =>
      celebrateCommentsSelector.mockReturnValue({
        ...celebrateComments,
        pagination: { hasNextPage: true },
      }));

    it('renders correctly', () => {
      expect(subject()).toMatchSnapshot();
    });

    it('renders item correctly', () => {
      expect(
        subject()
          .props()
          .renderItem({
            item: {
              content: 'hello roge',
            },
          }),
      ).toMatchSnapshot();
    });

    it('loads more comments', () => {
      subject()
        .props()
        .ListFooterComponent.props.onPress();

      expect(getCelebrateCommentsNextPage).toHaveBeenCalledWith(event);
      expect(store.getActions()).toEqual(
        expect.arrayContaining([getCelebrateCommentsNextPageResult]),
      );
    });
  });

  describe('without next page', () => {
    beforeEach(() =>
      celebrateCommentsSelector.mockReturnValue(celebrateComments));

    it('renders correctly', () => {
      expect(subject()).toMatchSnapshot();
    });
  });
});
