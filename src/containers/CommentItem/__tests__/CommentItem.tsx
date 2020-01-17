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
  person: { id: 'notme', first_name: 'Roge', last_name: 'Goers' },
};

const organization = { id: '7342342' };

const menuActions = [{ text: 'text', onPress: jest.fn() }];

// @ts-ignore
let screen;
const me = { id: 'me' };
// @ts-ignore
let store;

beforeEach(() => {
  store = configureStore([thunk])({
    auth: { person: me },
    celebrateComments: { editingCommentId: null },
  });
  screen = renderShallow(
    <CommentItem
      item={item}
      // @ts-ignore
      organization={organization}
      menuActions={menuActions}
    />,
    store,
  );
});

it('renders correctly', () => {
  // @ts-ignore
  expect(screen).toMatchSnapshot();
});

it('renders without menu actions', () => {
  screen = renderShallow(
    // @ts-ignore
    <CommentItem item={item} organization={organization} />,
    // @ts-ignore
    store,
  );

  expect(screen).toMatchSnapshot();
});

it('renders reported comment', () => {
  screen = renderShallow(
    <CommentItem
      item={item}
      // @ts-ignore
      isReported={true}
      organization={organization}
      menuActions={menuActions}
    />,
    // @ts-ignore
    store,
  );
  expect(screen).toMatchSnapshot();
});

it('renders my reported comment', () => {
  screen = renderShallow(
    <CommentItem
      item={{ ...item, person: { ...item.person, id: me.id } }}
      // @ts-ignore
      isReported={true}
      organization={organization}
      menuActions={menuActions}
    />,
    // @ts-ignore
    store,
  );
  expect(screen).toMatchSnapshot();
});

it('renders editing correctly', () => {
  store = configureStore([thunk])({
    auth: { person: me },
    // @ts-ignore
    celebrateComments: { editingCommentId: item.id },
  });
  screen = renderShallow(
    <CommentItem
      item={item}
      // @ts-ignore
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
        // @ts-ignore
        organization={organization}
        menuActions={menuActions}
        isMine={true}
      />,
      // @ts-ignore
      store,
    ),
  ).toMatchSnapshot();
});
