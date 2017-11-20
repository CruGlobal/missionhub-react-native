import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import { Button } from '../src/components/common';

it('renders correctly', () => {
  const tree = renderer.create(
    <Button onPress={() => {}} />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders pill correctly', () => {
  const tree = renderer.create(
    <Button pill={true} onPress={() => {}} />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders primary correctly', () => {
  const tree = renderer.create(
    <Button type="primary" onPress={() => {}} />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders secondary correctly', () => {
  const tree = renderer.create(
    <Button type="secondary" onPress={() => {}} />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders transparent correctly', () => {
  const tree = renderer.create(
    <Button type="transparent" onPress={() => {}} />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
