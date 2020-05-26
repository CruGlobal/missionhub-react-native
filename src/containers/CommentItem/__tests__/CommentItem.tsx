import 'react-native';
import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { renderWithContext } from '../../../../testUtils';
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { FeedItemCommentItem } from '../__generated__/FeedItemCommentItem';
import { FEED_ITEM_COMMENT_ITEM_FRAGMENT } from '../queries';

import CommentItem from '..';

Enzyme.configure({ adapter: new Adapter() });

const item = mockFragment<FeedItemCommentItem>(FEED_ITEM_COMMENT_ITEM_FRAGMENT);

const me = { id: 'me' };

const menuActions: {
  text: string;
  onPress: () => void;
  destructive?: boolean;
}[] = [{ text: 'text', onPress: jest.fn() }];

const initialState = {
  auth: { person: me },
  celebrateComments: { editingCommentId: null },
};

it('renders correctly', () => {
  renderWithContext(<CommentItem comment={item} menuActions={menuActions} />, {
    initialState,
  }).snapshot();
});

it('renders without menu actions', () => {
  renderWithContext(<CommentItem comment={item} />, {
    initialState,
  }).snapshot();
});

it('renders reported comment', () => {
  renderWithContext(
    <CommentItem comment={item} isReported={true} menuActions={menuActions} />,
    {
      initialState,
    },
  ).snapshot();
});

it('renders my reported comment', () => {
  renderWithContext(
    <CommentItem
      comment={{ ...item, person: { ...item.person, id: me.id } }}
      isReported={true}
      menuActions={menuActions}
    />,
    {
      initialState,
    },
  ).snapshot();
});

it('renders editing correctly', () => {
  renderWithContext(<CommentItem comment={item} menuActions={menuActions} />, {
    initialState: { ...initialState, editingCommentId: item.id },
  }).snapshot();
});

it('renders correctly as mine', () => {
  renderWithContext(
    <CommentItem
      comment={{ ...item, person: { ...item.person, id: me.id } }}
      menuActions={menuActions}
    />,
    {
      initialState,
    },
  ).snapshot();
});

it('renders reported story', () => {
  const storyItem = {
    ...item,
    author: {
      id: 'notme',
      firstName: 'Roge',
      lastName: 'Goers',
      fullName: 'Roge Goers',
    },
  };
  renderWithContext(
    <CommentItem
      comment={storyItem}
      isReported={true}
      menuActions={menuActions}
    />,
    {
      initialState,
    },
  ).snapshot();
});
