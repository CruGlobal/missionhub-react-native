import 'react-native';
import React from 'react';

import RadioButton from '..';

import { testSnapshot } from '../../../../testUtils';

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
