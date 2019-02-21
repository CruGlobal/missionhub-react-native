import 'react-native';
import React from 'react';

import SafeView from '..';

import { testSnapshot } from '../../../../testUtils';

it('renders correctly', () => {
  testSnapshot(<SafeView>Hello</SafeView>);
});

it('renders style correctly', () => {
  testSnapshot(<SafeView style={{ color: 'red' }}>Hello</SafeView>);
});

it('renders bg color primary correctly', () => {
  testSnapshot(<SafeView bg="primary">Hello</SafeView>);
});

it('renders bg color white correctly', () => {
  testSnapshot(<SafeView bg="white">Hello</SafeView>);
});
