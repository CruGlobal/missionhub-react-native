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

let onLongPress;

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
      onLongPress={onLongPress}
    />,
    store,
  );
});

it('renders correctly', () => {
  expect(screen).toMatchSnapshot();
});
it('renders not pressable', () => {
  screen = renderShallow(
    <CommentItem item={item} isPressable={false} organization={organization} />,
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
      onLongPress={onLongPress}
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
        onLongPress={onLongPress}
        isMine={true}
      />,
      store,
    ),
  ).toMatchSnapshot();
});

describe('onLongPress', () => {
  beforeAll(() => {
    onLongPress = jest.fn();
  });

  it('calls onLongPress', () => {
    screen
      .childAt(1)
      .childAt(0)
      .props()
      .onLongPress();

    expect(onLongPress).toHaveBeenCalledWith(item, undefined);
  });
});
