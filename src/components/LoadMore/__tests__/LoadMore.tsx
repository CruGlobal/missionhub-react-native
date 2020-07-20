import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';

import LoadMore from '..';

const onPress = jest.fn();

it('render load more button', () => {
  renderWithContext(<LoadMore onPress={onPress} />, {
    noWrappers: true,
  }).snapshot();
});

it('calls onPress prop', () => {
  const { getByTestId } = renderWithContext(<LoadMore onPress={onPress} />, {
    noWrappers: true,
  });
  fireEvent.press(getByTestId('Button'));
  expect(onPress).toHaveBeenCalled();
});
