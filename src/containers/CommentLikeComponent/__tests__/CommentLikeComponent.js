import 'react-native';
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import CommentLikeComponent from '..';

import { renderShallow } from '../../../../testUtils';

const mockStore = configureStore([thunk]);
let store;

const myId = '2342';

beforeEach(() => {
  jest.clearAllMocks();

  store = mockStore({ auth: { person: { id: myId } } });
});

it('renders nothing with no subject person', () => {
  expect(
    renderShallow(<CommentLikeComponent event={{}} />, store),
  ).toMatchSnapshot();
});

describe('with subject person', () => {
  const event = {
    subject_person: {},
    likes_count: 54,
    comments_count: 15,
  };

  it('renders for me', () => {
    expect(
      renderShallow(<CommentLikeComponent event={event} />, store),
    ).toMatchSnapshot();
  });

  it('renders for someone else', () => {
    expect(
      renderShallow(
        <CommentLikeComponent
          event={{ ...event, subject_person: { id: myId } }}
        />,
        store,
      ),
    ).toMatchSnapshot();
  });

  it('renders when liked', () => {
    expect(
      renderShallow(
        <CommentLikeComponent event={{ ...event, liked: true }} />,
        store,
      ),
    ).toMatchSnapshot();
  });
});
