import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';

import FilterItem from '..';

const mockItem = {
  id: '123',
  text: 'Test Step',
  preview: 'Preview',
};
const onSelect = jest.fn();

it('renders single item correctly', () => {
  renderWithContext(
    <FilterItem item={mockItem} onSelect={onSelect} type="single" />,
    { noWrappers: true },
  ).snapshot();
});

it('renders drilldown item correctly', () => {
  renderWithContext(
    <FilterItem item={mockItem} onSelect={onSelect} type="drilldown" />,
    { noWrappers: true },
  ).snapshot();
});

it('renders switch item correctly', () => {
  renderWithContext(
    <FilterItem item={mockItem} onSelect={onSelect} type="switch" />,
    { noWrappers: true },
  ).snapshot();
});

it('renders selected switch item correctly', () => {
  renderWithContext(
    <FilterItem
      item={mockItem}
      onSelect={onSelect}
      type="switch"
      isSelected={true}
    />,
    { noWrappers: true },
  ).snapshot();
});

it('presses select', () => {
  const { getByTestId } = renderWithContext(
    <FilterItem item={mockItem} onSelect={onSelect} type="drilldown" />,
    { noWrappers: true },
  );

  fireEvent.press(getByTestId('FilterItemTouchable'));
  expect(onSelect).toHaveBeenCalledWith(mockItem);
});
