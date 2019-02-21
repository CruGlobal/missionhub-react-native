import 'react-native';
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import CommentLikeComponent from '..';

import { renderShallow } from '../../../../testUtils';

const mockStore = configureStore([thunk]);
let store;

const event = {};

beforeEach(() => {
  jest.clearAllMocks();

  store = mockStore({ auth: { person: { id: '2342' } } });
});

it('renders nothing with no subject person', () => {
  expect(
    renderShallow(<CommentLikeComponent event={event} />, store),
  ).toMatchSnapshot();
});
