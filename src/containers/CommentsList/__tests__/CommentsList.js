import 'react-native';
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import CommentsList from '..';

import { renderShallow } from '../../../../testUtils';
import { celebrationItemSelector } from '../../../selectors/celebration';
import { celebrateCommentsSelector } from '../../../selectors/celebrateComments';

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

celebrationItemSelector.mockReturnValue(event);

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
  });

  describe('with next page', () => {
    beforeEach(() =>
      celebrateCommentsSelector.mockReturnValue(celebrateComments));

    it('renders correctly', () => {
      expect(subject()).toMatchSnapshot();
    });
  });
});
