import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import { Text } from '../src/components/common';
import {testSnapshot} from '../testUtils';

it('renders correctly', () => {
  testSnapshot(
    <Text>Hello</Text>
  );
});

it('renders style correctly', () => {
  testSnapshot(
    <Text style={{ color: 'red' }}>Hello</Text>
  );
});

it('renders animation correctly', () => {
  testSnapshot(
    <Text animation="bounce">Hello</Text>
  );
});

it('renders header font family correctly', () => {
  testSnapshot(
    <Text type="header">Hello</Text>
  );
});
