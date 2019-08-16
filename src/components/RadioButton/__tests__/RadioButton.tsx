import 'react-native';
import React from 'react';

import { renderWithContext } from '../../../../testUtils';

import RadioButton from '..';

const props = {
  onSelect: jest.fn(),
  label: 'Test label',
  checked: true,
};

it('renders correctly', () => {
  renderWithContext(<RadioButton {...props} />, {
    noWrappers: true,
  }).snapshot();
});

it('renders not checked correctly', () => {
  renderWithContext(<RadioButton {...props} />, {
    noWrappers: true,
  }).snapshot();
});

it('renders overriding default props', () => {
  renderWithContext(
    <RadioButton
      {...props}
      labelTextStyle={{ fontSize: 24 }}
      style={{ padding: 10 }}
      size={30}
      pressProps={['prop1', 'prop2']}
    />,
    { noWrappers: true },
  ).snapshot();
});
