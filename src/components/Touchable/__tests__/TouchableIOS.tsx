import React from 'react';
import { Text } from 'react-native';

import { renderWithContext } from '../../../../testUtils';
import Touchable from '../index.ios';

function snapshot(props = {}) {
  renderWithContext(
    <Touchable {...props}>
      <Text>Test</Text>
    </Touchable>,
    { noWrappers: true },
  ).snapshot();
  return;
}

it('renders touchable', () => {
  snapshot();
});

it('renders touchable highlight', () => {
  snapshot({ highlight: true });
});

it('renders touchable without feedback', () => {
  snapshot({ withoutFeedback: true });
});
