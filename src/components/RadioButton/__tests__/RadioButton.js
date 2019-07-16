import 'react-native';
import React from 'react';

import { testSnapshot } from '../../../../testUtils';

import RadioButton from '..';

const props = {
  onSelect: jest.fn(),
  label: 'Test label',
  checked: true,
};

it('renders correctly', () => {
  testSnapshot(<RadioButton {...props} />);
});

it('renders not checked correctly', () => {
  testSnapshot(<RadioButton {...props} checked={false} />);
});
