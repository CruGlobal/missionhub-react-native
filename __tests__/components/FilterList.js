import React from 'react';

import FilterList from '../../src/components/FilterList';
import { renderShallow } from '../../testUtils';

const options = [{ id: '1', text: 'option1' }, { id: '2', text: 'option 2' }];
const toggleOptions = [
  { id: '3', selected: true },
  { id: '2', selected: false },
];
const onDrillDown = jest.fn();
const onToggle = jest.fn();

const component = renderShallow(
  <FilterList
    options={options}
    toggleOptions={toggleOptions}
    onDrillDown={onDrillDown}
    onToggle={onToggle}
  />,
);

it('renders correctly', () => {
  expect(component).toMatchSnapshot();
});

it('handles drilldown', () => {
  const drilldownItem = component.childAt(1).childAt(0);
  const { item, type, onSelect } = drilldownItem.props();
  expect(type).toEqual('drilldown');

  onSelect(item);
  expect(onDrillDown).toHaveBeenCalledWith(item);
});

it('handles toggle', () => {
  const drilldownItem = component.childAt(1).childAt(2);
  const { item, type, onSelect } = drilldownItem.props();
  expect(type).toEqual('switch');

  onSelect(item);
  expect(onToggle).toHaveBeenCalledWith(item);
});
