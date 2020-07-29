import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import BottomButton from '..';

const onPress = jest.fn();
const text = 'Button Text';

describe('BottomButton', () => {
  it('renders correctly', () => {
    renderWithContext(<BottomButton text={text} onPress={onPress} />, {
      noWrappers: true,
    }).snapshot();
  });

  it('presses button', () => {
    const { getByTestId } = renderWithContext(
      <BottomButton text={text} onPress={onPress} />,
      {
        noWrappers: true,
      },
    );
    fireEvent.press(getByTestId('bottomButton'));
    expect(onPress).toHaveBeenCalled();
  });
});

describe('BottomButton disabled', () => {
  it('renders disabled correctly', () => {
    renderWithContext(
      <BottomButton text={text} onPress={onPress} disabled={true} />,
      {
        noWrappers: true,
      },
    ).snapshot();
  });
});
