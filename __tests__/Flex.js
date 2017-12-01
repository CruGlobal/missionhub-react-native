import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import { Flex } from '../src/components/common';
import {testSnapshot} from '../testUtils';

it('renders correctly', () => {
  testSnapshot(
    <Flex />
  );
});

it('renders align center correctly', () => {
  testSnapshot(
    <Flex align="center" />
  );
});

it('renders justify center correctly', () => {
  testSnapshot(
    <Flex justify="center" />
  );
});

it('renders alignSelf center correctly', () => {
  testSnapshot(
    <Flex self="center" />
  );
});

it('renders value correctly', () => {
  testSnapshot(
    <Flex value={1} />
  );
});

it('renders direction correctly', () => {
  testSnapshot(
    <Flex direction="row" />
  );
});

it('renders animation correctly', () => {
  testSnapshot(
    <Flex animation="bounce" />
  );
});
