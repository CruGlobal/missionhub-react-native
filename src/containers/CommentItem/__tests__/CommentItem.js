import 'react-native';
import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { renderShallow } from '../../../../testUtils';

import CommentItem from '..';

Enzyme.configure({ adapter: new Adapter() });

const item = {
  content: 'hello roge',
  created_at: '2018-06-11 12:00:00 UTC',
  person: { id: 'notme', first_name: 'Christian', last_name: 'Huffman' },
};

const reportedItem = {
  content: 'hello roge',
  created_at: '2018-06-11 12:00:00 UTC',
  person: { id: 'notme', fullName: 'Christian Huffman' },
};

const story = {
  content: 'hello roge',
  created_at: '2018-06-11 12:00:00 UTC',
  author: { id: 'notme', fullName: 'Christian Huffman' },
};

const organization = { id: '7342342' };

const menuActions = [{ text: 'text', onPress: jest.fn() }];

let screen;
const me = { id: 'me' };
let store;

beforeEach(() => {
  store = configureStore([thunk])({
    auth: { person: me },
    celebrateComments: { editingCommentId: null },
  });
  screen = renderShallow(
    <CommentItem
      item={item}
      organization={organization}
      menuActions={menuActions}
    />,
    store,
  );
});

it('renders correctly', () => {
  expect(screen).toMatchSnapshot();
});

it('renders without menu actions', () => {
  screen = renderShallow(
    <CommentItem item={item} organization={organization} />,
    store,
  );

  expect(screen).toMatchSnapshot();
});

it('renders reported comment', () => {
  screen = renderShallow(
    <CommentItem
      item={reportedItem}
      isReported={true}
      organization={organization}
      menuActions={menuActions}
    />,
    store,
  );
  expect(screen).toMatchSnapshot();
});

it('renders reported story', () => {
  screen = renderShallow(
    <CommentItem
      item={story}
      isReported={true}
      organization={organization}
      menuActions={menuActions}
    />,
    store,
  );
  expect(screen).toMatchSnapshot();
});

it('renders my reported comment', () => {
  screen = renderShallow(
    <CommentItem
      item={{ ...reportedItem, person: { ...reportedItem.person, id: me.id } }}
      isReported={true}
      organization={organization}
      menuActions={menuActions}
    />,
    store,
  );
  expect(screen).toMatchSnapshot();
});

it('renders editing correctly', () => {
  store = configureStore([thunk])({
    auth: { person: me },
    celebrateComments: { editingCommentId: item.id },
  });
  screen = renderShallow(
    <CommentItem
      item={item}
      organization={organization}
      menuActions={menuActions}
    />,
    store,
  );
  expect(screen).toMatchSnapshot();
});

it('renders correctly as mine', () => {
  expect(
    renderShallow(
      <CommentItem
        item={{ ...item, person: { ...item.person, ...me } }}
        organization={organization}
        menuActions={menuActions}
        isMine={true}
      />,
      store,
    ),
  ).toMatchSnapshot();
});
