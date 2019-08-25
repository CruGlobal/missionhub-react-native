import 'react-native';
import React from 'react';

import { renderWithContext } from '../../../../testUtils';

import FilterItem from '..';

const mockItem = {
  id: '123',
  text: 'Test Step',
  preview: 'Preview',
};
const onSelect = jest.fn();

jest.mock('Switch');

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
