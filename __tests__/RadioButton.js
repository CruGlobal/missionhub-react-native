import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import { RadioButton } from '../src/components/common';
import { testSnapshot } from '../testUtils';

const props = {
  onSelect: () => {},
  label: 'Test label',
  checked: true,
};

it('renders correctly', () => {
  testSnapshot(
    <RadioButton {...props} />
  );
});

it('renders not checked correctly', () => {
  testSnapshot(
    <RadioButton {...props} checked={false} />
  );
});