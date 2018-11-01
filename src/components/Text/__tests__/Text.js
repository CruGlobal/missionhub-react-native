import 'react-native';
import React from 'react';

import Text from '..';

import { testSnapshot } from '../../../../testUtils';

it('renders correctly', () => {
  testSnapshot(<Text>Hello</Text>);
});

it('renders style correctly', () => {
  testSnapshot(<Text style={{ color: 'red' }}>Hello</Text>);
});

it('renders animation correctly', () => {
  testSnapshot(<Text animation="bounce">Hello</Text>);
});

it('renders header font family correctly', () => {
  testSnapshot(<Text type="header">Hello</Text>);
});
