import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';

import BottomButton from '..';

const onPress = jest.fn();
const text = 'Button Text';

describe('BottomButton', () => {
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
    fireEvent.press(getByTestId('bottomButton'));
    expect(onPress).toHaveBeenCalled();
  });
});

describe('BottomButton disabled', () => {
  const { snapshot } = renderWithContext(
    <BottomButton text={text} onPress={onPress} disabled={true} />,
    {
      noWrappers: true,
    },
  );
  it('renders disabled correctly', () => {
    snapshot();
  });
});
