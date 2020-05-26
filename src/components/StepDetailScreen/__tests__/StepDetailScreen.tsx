import React from 'react';
import { Text, View } from 'react-native';

import { renderWithContext } from '../../../../testUtils';
import * as common from '../../../utils/common';

import StepDetailScreen from '..';

const firstName = 'Christian';
const mockPost = {
  author: { fullName: 'Robert Eldredge', id: '2', picture: 'mockpicture.jpeg' },
  createdAt: '2020-05-18T17:48:43Z',
  content: 'cool mock post',
};

beforeEach(() => {
  ((common as unknown) as { isAndroid: boolean }).isAndroid = false;
});

const snapshot = (props = {}) => {
  renderWithContext(
    <StepDetailScreen
      firstName={firstName}
      text="Roge is well behaved"
      CenterHeader={<View />}
      RightHeader={<View />}
      CenterContent={<Text>Center content</Text>}
      {...props}
    />,
  ).snapshot();
};

describe('Post is not null', () => {
  it('renders correctly with post', () => {
    snapshot({ post: mockPost, stepType: 'care' });
  });

  it('renders correctly with post with image', () => {
    snapshot({
      post: { ...mockPost, mediaExpiringUrl: 'mockImage.jpeg' },
      stepType: 'care',
    });
  });
  it('renders with an input', () => {
    snapshot({
      post: { ...mockPost, mediaExpiringUrl: 'mockImage.jpeg' },
      stepType: 'care',
      Input: <View>Input</View>,
    });
  });
});

describe('markdown is not null', () => {
  it('renders correctly', () => {
    snapshot({ markdown: 'ROBERT ROBERT ROBERT' });
  });

  it('renders correctly on android', () => {
    ((common as unknown) as { isAndroid: boolean }).isAndroid = true;
    snapshot({ markdown: 'ROBERT ROBERT ROBERT' });
  });

  it('renders correctly with bottom button props', () => {
    snapshot({
      markdown: 'ROBERT ROBERT ROBERT',
      bottomButtonProps: { text: 'bottom button props', onPress: () => {} },
    });
  });

  it('renders correctly on android with bottom button props', () => {
    ((common as unknown) as { isAndroid: boolean }).isAndroid = true;
    snapshot({
      markdown: 'ROBERT ROBERT ROBERT',
      bottomButtonProps: { text: 'bottom button props', onPress: () => {} },
    });
  });
});

describe('markdown with <<name>> to change', () => {
  it('renders correctly', () => {
    snapshot({ markdown: '<<name>> <<name>> <<name>>' });
  });
});

describe('renders with hideBackButton', () => {
  it('renders correctly', () => {
    snapshot({ hideBackButton: true });
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
