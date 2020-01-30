import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import {
  createCelebrateComment,
  resetCelebrateEditingComment,
  updateCelebrateComment,
} from '../../../actions/celebrateComments';
import { celebrateCommentsCommentSelector } from '../../../selectors/celebrateComments';
import { GetCelebrateFeed_community_celebrationItems_nodes } from '../../../containers/CelebrateFeed/__generated__/GetCelebrateFeed';

import CelebrateCommentBox from '..';

jest.mock('../../../selectors/celebrateComments');
jest.mock('../../../actions/celebrateComments');

const event: GetCelebrateFeed_community_celebrationItems_nodes = {
  __typename: 'CommunityCelebrationItem',
  id: '1',
  adjectiveAttributeName: null,
  adjectiveAttributeValue: null,
  celebrateableId: '1',
  celebrateableType: '',
  changedAttributeName: '',
  changedAttributeValue: '',
  commentsCount: 0,
  liked: true,
  likesCount: 1,
  objectDescription: null,
  subjectPerson: null,
  subjectPersonName: null,
};

const createCelebrateCommentResult = { type: 'created comment' };
const updateCelebrateCommentResult = { type: 'update comment' };
const resetCelebrateEditingCommentResult = { type: 'reset editing' };

const editingComment = {
  id: 'edit',
  content: 'test',
};
const onAddComplete = jest.fn();
const initialState = {
  celebrateComments: {
    editingCommentId: null,
  },
};

function render() {
  return renderWithContext(
    <CelebrateCommentBox event={event} onAddComplete={onAddComplete} />,
    { initialState },
  );
}
beforeEach(() => {
  (createCelebrateComment as jest.Mock).mockReturnValue(
    createCelebrateCommentResult,
  );
  (updateCelebrateComment as jest.Mock).mockReturnValue(
    updateCelebrateCommentResult,
  );
  (resetCelebrateEditingComment as jest.Mock).mockReturnValue(
    resetCelebrateEditingCommentResult,
  );
});

it('renders correctly', () => {
  render().snapshot();
});

it('renders correctly without finding celebrate comment', () => {
  (createCelebrateComment as jest.Mock).mockReturnValue(undefined);
  render().snapshot();
});

describe('onSubmit', () => {
  it('creates comment with add', async () => {
    const text = 'roger is a good pig';
    const { getByTestId } = render();

    await fireEvent(getByTestId('CelebrateCommentBox'), 'onSubmit', null, text);

    expect(createCelebrateComment).toHaveBeenCalledWith(event, text);
    expect(onAddComplete).toHaveBeenCalled();
  });
});

it('renders editing correctly', () => {
  ((celebrateCommentsCommentSelector as unknown) as jest.Mock).mockReturnValue(
    editingComment,
  );

  renderWithContext(<CelebrateCommentBox event={event} />, {
    initialState: {
      ...initialState,
      celebrateComments: { editingCommentId: editingComment.id },
    },
  }).snapshot();
});

it('onCancel', () => {
  const { getByTestId } = render();

  fireEvent(getByTestId('CelebrateCommentBox'), 'onCancel');

  expect(resetCelebrateEditingComment).toHaveBeenCalled();
});

it('calls update', async () => {
  ((celebrateCommentsCommentSelector as unknown) as jest.Mock).mockReturnValue(
    editingComment,
  );

  const { getByTestId } = renderWithContext(
    <CelebrateCommentBox event={event} />,
    {
      initialState: {
        ...initialState,
        celebrateComments: { editingCommentId: editingComment.id },
      },
    },
  );

  const text = 'test update';
  await fireEvent(getByTestId('CelebrateCommentBox'), 'onSubmit', null, text);

  expect(resetCelebrateEditingComment).toHaveBeenCalled();
  expect(updateCelebrateComment).toHaveBeenCalledWith(editingComment, text);
});
