import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import { Flex } from '../src/components/common';

it('renders correctly', () => {
  const tree = renderer.create(
    <Flex />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders align center correctly', () => {
  const tree = renderer.create(
    <Flex align="center" />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders justify center correctly', () => {
  const tree = renderer.create(
    <Flex justify="center" />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders alignSelf center correctly', () => {
  const tree = renderer.create(
    <Flex self="center" />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders value correctly', () => {
  const tree = renderer.create(
    <Flex value={1} />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders direction correctly', () => {
  const tree = renderer.create(
    <Flex direction="row" />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders animation correctly', () => {
  const tree = renderer.create(
    <Flex animation="bounce" />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
