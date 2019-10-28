import React from 'react';
import { View } from 'react-native';

import { renderWithContext } from '../../../../testUtils';

import PlatformKeyboardAvoidingView from '..';

it('renders correctly', () => {
  renderWithContext(
    <PlatformKeyboardAvoidingView>
      <View />
    </PlatformKeyboardAvoidingView>,
    { noWrappers: true },
  ).snapshot();
});

it('renders correctly with style', () => {
  renderWithContext(
    <PlatformKeyboardAvoidingView style={{ padding: 10 }}>
      <View />
    </PlatformKeyboardAvoidingView>,
    { noWrappers: true },
  ).snapshot();
});

it('renders correctly with offset', () => {
  renderWithContext(
    <PlatformKeyboardAvoidingView offset={25}>
      <View />
    </PlatformKeyboardAvoidingView>,
    { noWrappers: true },
  ).snapshot();
});
