import React from 'react';
import { fireEvent } from 'react-native-testing-library';
import debounce from 'lodash/debounce';

import { renderWithContext } from '../../../../testUtils';

import Button, { ButtonProps } from '..';

// Tell jest to mock this import
jest.mock('lodash/debounce');

beforeAll(() => {
  (debounce as jest.Mock).mockImplementation(fn => fn); // Assign the import a new implementation, in this case it's execute the function given to you
});

it('renders correctly', () => {
  renderWithContext(<Button onPress={jest.fn()} />, {
    noWrappers: true,
  }).snapshot();
});

it('renders pill correctly', () => {
  renderWithContext(<Button pill={true} onPress={jest.fn()} />, {
    noWrappers: true,
  }).snapshot();
});

it('renders primary correctly', () => {
  renderWithContext(<Button type="primary" onPress={jest.fn()} />, {
    noWrappers: true,
  }).snapshot();
});

it('renders secondary correctly', () => {
  renderWithContext(<Button type="secondary" onPress={jest.fn()} />, {
    noWrappers: true,
  }).snapshot();
});

it('renders transparent correctly', () => {
  renderWithContext(<Button type="transparent" onPress={jest.fn()} />, {
    noWrappers: true,
  }).snapshot();
});

it('calls on press with press props', () => {
  const pressProps = ['test'];
  const props: ButtonProps = {
    type: 'transparent',
    onPress: jest.fn(),
    pressProps,
  };
  const { getByTestId } = renderWithContext(<Button {...props} />, {
    noWrappers: true,
  });
  fireEvent.press(getByTestId('Button'));
  expect(props.onPress).toHaveBeenCalledWith(pressProps[0]);
});

it('calls on press without press props', () => {
  const props: ButtonProps = {
    type: 'transparent',
    onPress: jest.fn(),
  };
  const { getByTestId } = renderWithContext(<Button {...props} />, {
    noWrappers: true,
  });
  fireEvent.press(getByTestId('Button'));
  expect(props.onPress).toHaveBeenCalledWith();
});
