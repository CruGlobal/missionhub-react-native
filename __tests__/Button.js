import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import { Button } from '../src/components/common';
import { testSnapshot } from '../testUtils';

it('renders correctly', () => {
  testSnapshot(
    <Button onPress={() => {}} />
  );
});

it('renders pill correctly', () => {
  testSnapshot(
    <Button pill={true} onPress={() => {}} />
  );
});

it('renders primary correctly', () => {
  testSnapshot(
    <Button type="primary" onPress={() => {}} />
  );
});

it('renders secondary correctly', () => {
  testSnapshot(
    <Button type="secondary" onPress={() => {}} />
  );
});

it('renders transparent correctly', () => {
  testSnapshot(
    <Button type="transparent" onPress={() => {}} />
  );
});
