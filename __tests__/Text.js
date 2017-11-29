import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import { Text } from '../src/components/common';

it('renders correctly', () => {
  const tree = renderer.create(
    <Text>Hello</Text>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders style correctly', () => {
  const tree = renderer.create(
    <Text style={{ color: 'red' }}>Hello</Text>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders animation correctly', () => {
  const tree = renderer.create(
    <Text animation="bounce">Hello</Text>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders header font family correctly', () => {
  const tree = renderer.create(
    <Text type="header">Hello</Text>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
