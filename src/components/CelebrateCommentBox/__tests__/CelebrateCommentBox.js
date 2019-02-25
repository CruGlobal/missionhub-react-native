import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { renderShallow } from '../../../../testUtils';

import CelebrateCommentBox from '..';

import { createCelebrateComment } from '../../../actions/celebrateComments';

jest.mock('../../../actions/celebrateComments');

const mockStore = configureStore([thunk]);
const event = { text: 'some celebrate item' };
const createCelebrateCommentResult = { type: 'created comment' };

let screen;
let store;

createCelebrateComment.mockReturnValue(createCelebrateCommentResult);

beforeEach(() => {
  jest.clearAllMocks();

  store = mockStore();

  screen = renderShallow(<CelebrateCommentBox event={event} />, store);
});

it('renders correctly', () => {
  expect(screen).toMatchSnapshot();
});

describe('onSubmit', () => {
  it('creates comment', () => {
    const text = 'roger is a good pig';

    screen.props().onSubmit(null, text);

    expect(createCelebrateComment).toHaveBeenCalledWith(event, text);
    expect(store.getActions()).toEqual([createCelebrateCommentResult]);
  });
});
