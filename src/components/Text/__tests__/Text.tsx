import 'react-native';
import React from 'react';

import { testSnapshot } from '../../../../testUtils';

import Text from '..';

it('renders correctly', () => {
  testSnapshot(<Text>Hello</Text>);
});

it('renders style correctly', () => {
  testSnapshot(<Text style={{ color: 'red' }}>Hello</Text>);
});

it('renders header font family correctly', () => {
  testSnapshot(<Text header={true}>Hello</Text>);
});
