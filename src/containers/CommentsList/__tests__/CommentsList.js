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
celebrateCommentsSelector.mockReturnValue(celebrateComments);

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

it('renders correctly', () => {
  expect(subject()).toMatchSnapshot();
});
