import 'react-native';
import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { renderWithContext } from '../../../../testUtils';
import { CelebrateComment } from '../../../reducers/celebrateComments';
import { Organization } from '../../../reducers/organizations';

import CommentItem from '..';

Enzyme.configure({ adapter: new Adapter() });

const item: CelebrateComment = {
  id: '1',
  content: 'hello roge',
  created_at: '2018-06-11 12:00:00 UTC',
  updated_at: '2018-06-11 12:00:00 UTC',
  person: { id: 'notme', first_name: 'Roge', last_name: 'Goers' },
};

const me = { id: 'me' };
const organization: Organization = { id: '7342342' };

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
  renderWithContext(
    <CommentItem
      item={item}
      organization={organization}
      menuActions={menuActions}
    />,
    {
      initialState,
    },
  ).snapshot();
});

it('renders without menu actions', () => {
  renderWithContext(<CommentItem item={item} organization={organization} />, {
    initialState,
  }).snapshot();
});

it('renders reported comment', () => {
  renderWithContext(
    <CommentItem
      item={item}
      isReported={true}
      organization={organization}
      menuActions={menuActions}
    />,
    {
      initialState,
    },
  ).snapshot();
});

it('renders my reported comment', () => {
  renderWithContext(
    <CommentItem
      item={{ ...item, person: { ...item.person, id: me.id } }}
      isReported={true}
      organization={organization}
      menuActions={menuActions}
    />,
    {
      initialState,
    },
  ).snapshot();
});

it('renders editing correctly', () => {
  renderWithContext(
    <CommentItem
      item={item}
      organization={organization}
      menuActions={menuActions}
    />,
    {
      initialState: { ...initialState, editingCommentId: item.id },
    },
  ).snapshot();
});

it('renders correctly as mine', () => {
  renderWithContext(
    <CommentItem
      item={{ ...item, person: { ...item.person, id: me.id } }}
      organization={organization}
      menuActions={menuActions}
    />,
    {
      initialState,
    },
  ).snapshot();
});

it('renders reported story', () => {
  const storyItem = {
    id: '1',
    content: 'hello roge',
    createdAt: '2018-06-11 12:00:00 UTC',
    updated_at: '2018-06-11 12:00:00 UTC',
    author: {
      id: 'notme',
      firstName: 'Roge',
      lastName: 'Goers',
      fullName: 'Roge Goers',
    },
  };
  renderWithContext(
    <CommentItem
      item={storyItem}
      isReported={true}
      organization={organization}
      menuActions={menuActions}
    />,
    {
      initialState,
    },
  ).snapshot();
});
