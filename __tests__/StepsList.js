import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import StepsList from '../src/components/StepsList';
import {testSnapshot} from '../testUtils';

const items = [
  {body: 'I feel great', selected: true},
  {body: 'I feel wonderful', selected: false},
];

it('renders correctly', () => {
  testSnapshot(
    <StepsList items={items} />
  );
});
