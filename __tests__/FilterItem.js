import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import FilterItem from '../src/components/FilterItem';
import { testSnapshot } from '../testUtils';

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
