import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';

import FilterList from '..';

const options = [
  { id: '1', text: 'option1' },
  { id: '2', text: 'option 2' },
];
const toggleOptions = [
  { id: '3', selected: true },
  { id: '2', selected: false },
];
const onDrillDown = jest.fn();
const onToggle = jest.fn();

const props = { options, toggleOptions, onDrillDown, onToggle };

it('renders correctly', () => {
  renderWithContext(<FilterList {...props} />).snapshot();
});

it('handles drilldown', () => {
  const { getByTestId } = renderWithContext(<FilterList {...props} />);

  fireEvent(getByTestId('FilterListOption0'), 'onSelect', options[0]);

  expect(onDrillDown).toHaveBeenCalledWith(options[0]);
});

it('handles toggle', () => {
  const { getByTestId } = renderWithContext(<FilterList {...props} />);

  fireEvent(
    getByTestId('FilterListToggleOption0'),
    'onSelect',
    toggleOptions[0],
  );

  expect(onToggle).toHaveBeenCalledWith(toggleOptions[0]);
});
