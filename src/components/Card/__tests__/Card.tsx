import React from 'react';
import { View, Text } from 'react-native';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import Card from '..';

const content = 'Testing';

const children = (
  <View>
    <Text>{content}</Text>
  </View>
);

it('render card', () => {
  renderWithContext(<Card />, { noWrappers: true }).snapshot();
});

it('render card with children', () => {
  renderWithContext(<Card>{children}</Card>, { noWrappers: true }).snapshot();
});

it('render touchable card', () => {
  renderWithContext(<Card onPress={jest.fn()} />, {
    noWrappers: true,
  }).snapshot();
});

it('render touchable card with children', () => {
  renderWithContext(<Card onPress={jest.fn()}>{children}</Card>, {
    noWrappers: true,
  }).snapshot();
});

it('calls props.onPress when pressed', () => {
  const onPress = jest.fn();
  const { getByText } = renderWithContext(
    <Card onPress={onPress}>{children}</Card>,
    {
      noWrappers: true,
    },
  );

  fireEvent.press(getByText(content));

  expect(onPress).toHaveBeenCalled();
});

it('calls props.onPress when pressed', () => {
  const onPress = jest.fn();
  const { getByText } = renderWithContext(
    <Card onPress={onPress}>{children}</Card>,
    {
      noWrappers: true,
    },
  );

  fireEvent.press(getByText(content));

  expect(onPress).toHaveBeenCalled();
});
