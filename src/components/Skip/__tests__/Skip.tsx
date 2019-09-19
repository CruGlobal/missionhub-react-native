import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';

import Skip from '..';

it('render skip', () => {
  renderWithContext(<Skip onSkip={jest.fn()} />).snapshot();
});

it('renders skip with style', () => {
  renderWithContext(
    <Skip onSkip={jest.fn()} style={{ padding: 5 }} />,
  ).snapshot();
});
it('renders skip with text style', () => {
  renderWithContext(
    <Skip onSkip={jest.fn()} textStyle={{ padding: 5 }} />,
  ).snapshot();
});

it('calls onSkip when pressed', () => {
  const onSkip = jest.fn();
  const { getByTestId } = renderWithContext(<Skip onSkip={onSkip} />);

  fireEvent.press(getByTestId('skipButton'));

  expect(onSkip).toHaveBeenCalled();
});
