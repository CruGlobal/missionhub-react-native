import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { renderShallow } from '../../../../testUtils';
import {
  createCelebrateComment,
  resetCelebrateEditingComment,
  updateCelebrateComment,
} from '../../../actions/celebrateComments';
import { celebrationItemSelector } from '../../../selectors/celebration';
import { celebrateCommentsCommentSelector } from '../../../selectors/celebrateComments';

import CelebrateCommentBox from '..';

jest.mock('../../../selectors/celebration');
jest.mock('../../../selectors/celebrateComments');
jest.mock('../../../actions/celebrateComments');

const mockStore = configureStore([thunk]);
const event = { text: 'some celebrate item', organization: { id: 'orgId' } };
const createCelebrateCommentResult = { type: 'created comment' };
const updateCelebrateCommentResult = { type: 'update comment' };
const resetCelebrateEditingCommentResult = { type: 'reset editing' };

let screen;
let store;

createCelebrateComment.mockReturnValue(createCelebrateCommentResult);
updateCelebrateComment.mockReturnValue(updateCelebrateCommentResult);
resetCelebrateEditingComment.mockReturnValue(
  resetCelebrateEditingCommentResult,
);
celebrationItemSelector.mockReturnValue(event);

const editingComment = {
  id: 'edit',
  content: 'test',
};

beforeEach(() => {
  store = mockStore({
    organizations: [],
    celebrateComments: {
      editingCommentId: null,
    },
  });

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

it('renders editing correctly', () => {
  celebrateCommentsCommentSelector.mockReturnValue(editingComment);
  store = mockStore({
    organizations: [],
    celebrateComments: {
      editingCommentId: editingComment.id,
    },
  });

  screen = renderShallow(<CelebrateCommentBox event={event} />, store);
  expect(screen).toMatchSnapshot();
});

it('onCancel', () => {
  screen.props().onCancel();

  expect(resetCelebrateEditingComment).toHaveBeenCalled();
});

it('componentWillUnmount', () => {
  screen.instance().componentWillUnmount();

  expect(resetCelebrateEditingComment).toHaveBeenCalled();
});

it('calls update', () => {
  celebrateCommentsCommentSelector.mockReturnValue(editingComment);
  store = mockStore({
    organizations: [],
    celebrateComments: {
      editingCommentId: editingComment.id,
    },
  });

  screen = renderShallow(<CelebrateCommentBox event={event} />, store);
  const text = 'test update';
  screen.props().onSubmit(null, text);

  expect(resetCelebrateEditingComment).toHaveBeenCalled();
  expect(updateCelebrateComment).toHaveBeenCalledWith(editingComment, text);
  expect(store.getActions()).toEqual([
    resetCelebrateEditingCommentResult,
    updateCelebrateCommentResult,
  ]);
});
