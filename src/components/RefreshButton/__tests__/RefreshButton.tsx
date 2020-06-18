import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';

import RefreshButton from '..';

const mockRefresh = jest.fn();

it('renders correctly', () => {
  renderWithContext(
    <RefreshButton refresh={mockRefresh} loading={false} />,
  ).snapshot();
});

it('renders loading correctly', () => {
  renderWithContext(
    <RefreshButton refresh={mockRefresh} loading={true} />,
  ).snapshot();
});

it('fires refresh onPress', () => {
  const { getByTestId } = renderWithContext(
    <RefreshButton refresh={mockRefresh} loading={false} />,
  );
  fireEvent.press(getByTestId('refreshButton'));
  expect(mockRefresh).toHaveBeenCalled();
});
