import React from 'react';
import { Text, View } from 'react-native';

import { renderWithContext } from '../../../../testUtils/index';
import StepDetailScreen from '../index';

function snapshot(props = {}) {
  renderWithContext(
    <StepDetailScreen
      text="Roge is well behaved"
      CenterHeader={<View />}
      RightHeader={<View />}
      CenterContent={<Text>Center content</Text>}
      {...props}
    />,
  ).snapshot();
}

describe('markdown is not null', () => {
  it('renders correctly', () => {
    snapshot({ markdown: 'ROBERT ROBERT ROBERT' });
  });
});

describe('markdown is empty string', () => {
  it('renders correctly', () => {
    snapshot({ markdown: '' });
  });
});

describe('markdown is null', () => {
  describe('bottomButtonProps are not null', () => {
    it('renders correctly', () => {
      snapshot({
        markdown: null,
        bottomButtonProps: { text: 'bottom button props', onPress: () => {} },
      });
    });
  });

  describe('bottomButtonProps are null', () => {
    it('renders correctly', () => {
      snapshot({ bottomButtonProps: null });
    });
  });
});
