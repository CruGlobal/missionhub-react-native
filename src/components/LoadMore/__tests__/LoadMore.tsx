import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';

import LoadMore from '..';

const onPress = jest.fn();
const { getByTestId, snapshot } = renderWithContext(
  <LoadMore onPress={onPress} />,
  {
    noWrappers: true,
  },
);

it('render load more button', () => {
  snapshot();
});

it('calls onPress prop', () => {
  fireEvent.press(getByTestId('Button'));
  expect(onPress).toHaveBeenCalled();
});
