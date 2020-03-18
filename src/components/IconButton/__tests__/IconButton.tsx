import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';

import IconButton from '..';

const onPress = jest.fn();

it('renders correctly', () => {
  renderWithContext(
    <IconButton
      name="addContactIcon"
      type="MissionHub"
      pressProps={['test']}
      onPress={onPress}
    />,
    {
      noWrappers: true,
    },
  ).snapshot();
});

it('renders correctly without onpress', () => {
  renderWithContext(
    <IconButton
      name="addContactIcon"
      type="MissionHub"
      style={{ padding: 10 }}
    />,
    {
      noWrappers: true,
    },
  ).snapshot();
});

it('renders correctly with image', () => {
  renderWithContext(
    <IconButton
      name="testImage"
      type="MissionHub"
      image={1234}
      buttonStyle={{ margin: 20 }}
      style={{ padding: 10 }}
    />,
    {
      noWrappers: true,
    },
  ).snapshot();
});

it('renders correctly with button styles', () => {
  renderWithContext(
    <IconButton
      name="addContactIcon"
      type="MissionHub"
      buttonStyle={{ margin: 20 }}
      style={{ padding: 10 }}
    />,
    {
      noWrappers: true,
    },
  ).snapshot();
});

it('renders correctly with icon props', () => {
  renderWithContext(
    <IconButton
      name="addContactIcon"
      type="MissionHub"
      size={24}
      style={{ padding: 10 }}
    />,
    {
      noWrappers: true,
    },
  ).snapshot();
});

it('presses icon button', () => {
  fireEvent.press(
    renderWithContext(
      <IconButton
        name="addContactIcon"
        type="MissionHub"
        pressProps={['test']}
        onPress={onPress}
      />,
      {
        noWrappers: true,
      },
    ).getByTestId('IconButton'),
  );
  expect(onPress).toHaveBeenCalledWith('test');
});
