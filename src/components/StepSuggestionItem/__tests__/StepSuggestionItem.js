import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import StepSuggestionItem from '../';

const step = {
  id: '1',
  body: 'Step of Faith',
};

const onPress = jest.fn();

describe('StepSuggestionItem', () => {
  it('renders correctly', () => {
    renderWithContext(
      <StepSuggestionItem step={step} onPress={onPress} />,
    ).snapshot();
  });

  it('calls onPress', () => {
    const { getByTestId } = renderWithContext(
      <StepSuggestionItem step={step} onPress={onPress} />,
    );

    fireEvent.press(getByTestId('stepSuggestionCard'));

    expect(onPress).toHaveBeenCalledWith(step);
  });
});
