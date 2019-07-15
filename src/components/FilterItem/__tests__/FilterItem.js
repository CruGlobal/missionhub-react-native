import 'react-native';
import React from 'react';

import { testSnapshot } from '../../../../testUtils';

import FilterItem from '..';

const mockItem = {
  id: '123',
  text: 'Test Step',
  preview: 'Preview',
};
const onSelect = jest.fn();

jest.mock('Switch');

it('renders single item correctly', () => {
  testSnapshot(
    <FilterItem item={mockItem} onSelect={onSelect} type="single" />,
  );
});

it('renders drilldown item correctly', () => {
  testSnapshot(
    <FilterItem item={mockItem} onSelect={onSelect} type="drilldown" />,
  );
});

it('renders switch item correctly', () => {
  testSnapshot(
    <FilterItem item={mockItem} onSelect={onSelect} type="switch" />,
  );
});

it('renders selected switch item correctly', () => {
  testSnapshot(
    <FilterItem
      item={mockItem}
      onSelect={onSelect}
      type="switch"
      isSelected={true}
    />,
  );
});
