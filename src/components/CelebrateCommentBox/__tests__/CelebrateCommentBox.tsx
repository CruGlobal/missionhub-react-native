import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import {
  createCelebrateComment,
  resetCelebrateEditingComment,
  updateCelebrateComment,
} from '../../../actions/celebrateComments';
import { celebrateCommentsCommentSelector } from '../../../selectors/celebrateComments';
import { Organization } from '../../../reducers/organizations';
import { CELEBRATE_ITEM_FRAGMENT } from '../../CommunityFeedItem/queries';
import { GetCelebrateFeed_community_celebrationItems_nodes as CelebrateItem } from '../../../containers/CelebrateFeed/__generated__/GetCelebrateFeed';

import CelebrateCommentBox from '..';

jest.mock('../../../selectors/celebrateComments');
jest.mock('../../../actions/celebrateComments');

const organization: Organization = { id: '123' };
const event = mockFragment<CelebrateItem>(CELEBRATE_ITEM_FRAGMENT);

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
    <CelebrateCommentBox
      event={event}
      organization={organization}
      onAddComplete={onAddComplete}
    />,
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

    expect(createCelebrateComment).toHaveBeenCalledWith(
      event.id,
      organization.id,
      text,
    );
    expect(onAddComplete).toHaveBeenCalled();
  });
});

it('renders editing correctly', () => {
  ((celebrateCommentsCommentSelector as unknown) as jest.Mock).mockReturnValue(
    editingComment,
  );

  renderWithContext(
    <CelebrateCommentBox event={event} organization={organization} />,
    {
      initialState: {
        ...initialState,
        celebrateComments: { editingCommentId: editingComment.id },
      },
    },
  ).snapshot();
});

it('onCancel', () => {
  const { getByTestId } = render();

  fireEvent(getByTestId('CelebrateCommentBox'), 'onCancel');

  expect(resetCelebrateEditingComment).toHaveBeenCalledWith();
});

it('calls update', async () => {
  ((celebrateCommentsCommentSelector as unknown) as jest.Mock).mockReturnValue(
    editingComment,
  );

  const { getByTestId } = renderWithContext(
    <CelebrateCommentBox event={event} organization={organization} />,
    {
      initialState: {
        ...initialState,
        celebrateComments: { editingCommentId: editingComment.id },
      },
    },
  );

  const text = 'test update';
  await fireEvent(getByTestId('CelebrateCommentBox'), 'onSubmit', null, text);

  expect(resetCelebrateEditingComment).toHaveBeenCalledWith();
  expect(updateCelebrateComment).toHaveBeenCalledWith(
    event.id,
    organization.id,
    editingComment.id,
    text,
  );
});
