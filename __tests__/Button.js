import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';

// Note: test renderer must be required after react-native.
import { Button } from '../src/components/common';
import { testSnapshot } from '../testUtils';

it('renders correctly', () => {
  testSnapshot(<Button onPress={jest.fn()} />);
});

it('renders pill correctly', () => {
  testSnapshot(<Button pill={true} onPress={jest.fn()} />);
});

it('renders primary correctly', () => {
  testSnapshot(<Button type="primary" onPress={jest.fn()} />);
});

it('renders secondary correctly', () => {
  testSnapshot(<Button type="secondary" onPress={jest.fn()} />);
});

it('renders transparent correctly', () => {
  testSnapshot(<Button type="transparent" onPress={jest.fn()} />);
});

it('calls on press with press props', () => {
  const props = {
    type: 'transparent',
    onPress: jest.fn(),
    pressProps: ['test'],
  };
  const instance = shallow(<Button {...props} />).instance();
  instance.handlePress();
  expect(props.onPress).toHaveBeenCalledWith(props.pressProps[0]);
});

it('calls on press without press props', () => {
  const props = {
    type: 'transparent',
    onPress: jest.fn(),
  };
  const instance = shallow(<Button {...props} />).instance();
  instance.handlePress();
  expect(props.onPress).toHaveBeenCalledWith();
});
