import 'react-native';
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
      size={24}
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
    ).getByTestId('Button'),
  );
  expect(onPress).toHaveBeenCalledWith('test');
});
