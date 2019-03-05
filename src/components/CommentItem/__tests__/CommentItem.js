import 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import CommentItem from '..';

Enzyme.configure({ adapter: new Adapter() });

const item = {
  content: 'hello roge',
  created_at: '2018-06-11 12:00:00 UTC',
  person: { first_name: 'Roge', last_name: 'Goers' },
};

const organization = { id: '7342342' };

let onLongPress;

let screen;

beforeEach(() => {
  screen = shallow(
    <CommentItem
      item={item}
      organization={organization}
      onLongPress={onLongPress}
    />,
  );
});

describe('with onLongPress', () => {
  beforeAll(() => {
    onLongPress = jest.fn();
  });

  it('renders correctly with onLongPress', () => {
    expect(screen).toMatchSnapshot();
  });

  it('calls onLongPress', () => {
    screen.props().onLongPress();

    expect(onLongPress).toHaveBeenCalledWith(item, undefined);
  });
});

describe('without onLongPress', () => {
  beforeAll(() => {
    onLongPress = null;
  });

  it('renders correctly', () => {
    expect(screen).toMatchSnapshot();
  });

  it('calls ref', () => {
    const instance = screen.instance();
    instance.view = null;
    instance.ref('test');
    expect(instance.view).toEqual('test');
  });
});
