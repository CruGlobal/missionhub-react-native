import React from 'react';
import * as ReactNative from 'react-native';

import { renderWithContext } from '../../../../testUtils';
import Touchable from '../index.android';

ReactNative.Platform.OS = 'android';

function snapshot(props = {}) {
  renderWithContext(
    <Touchable {...props}>
      <ReactNative.Text>Test</ReactNative.Text>
    </Touchable>,
    { noWrappers: true },
  ).snapshot();
  return;
}

it('renders touchable', () => {
  snapshot();
});

it('renders touchable opacity', () => {
  snapshot({ isAndroidOpacity: true });
});

it('renders touchable without feedback', () => {
  snapshot({ withoutFeedback: true });
});

it('renders touchable with style', () => {
  snapshot({ style: { padding: 25 } });
});

it('renders touchable with platform > 21', () => {
  ReactNative.Platform.Version = 25;
  snapshot();
});

it('renders touchable with platform > 21 borderless', () => {
  ReactNative.Platform.Version = 25;
  snapshot({ borderless: true });
});

it('renders touchable with platform < 21', () => {
  ReactNative.Platform.Version = 20;
  snapshot();
});
