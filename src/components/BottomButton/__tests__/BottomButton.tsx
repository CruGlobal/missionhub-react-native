import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils/index';

import BottomButton from '..';

const onPress = jest.fn();
const text = 'Button Text';

const { getByTestId, snapshot } = renderWithContext(
  <BottomButton text={text} onPress={onPress} />,
  {
    noWrappers: true,
  },
);
it('renders correctly', () => {
  snapshot();
});

it('presses button', () => {
  fireEvent.press(getByTestId('Button'));
  expect(onPress).toHaveBeenCalled();
});
