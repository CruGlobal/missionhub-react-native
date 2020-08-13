import React from 'react';
import { Text } from 'react-native';

import { renderWithContext } from '../../../../testUtils';
import VideoPlayer from '../';

jest.mock('react-native-video', () => 'Video');

it('renders correctly', () => {
  renderWithContext(<VideoPlayer uri={'testVideo.mp4'} />).snapshot();
});

it('renders with style', () => {
  renderWithContext(
    <VideoPlayer uri={'testVideo.mp4'} style={{ height: 1000 }} />,
  ).snapshot();
});

it('renders with custom controls', () => {
  const customControls = <Text>Controls</Text>;

  renderWithContext(
    <VideoPlayer
      uri={'testVideo.mp4'}
      customControls={customControls}
      style={{ height: 1000 }}
    />,
  ).snapshot();
});

it('renders with width', () => {
  renderWithContext(
    <VideoPlayer uri={'testVideo.mp4'} width={900} />,
  ).snapshot();
});

it('sets paused to false', () => {
  renderWithContext(
    <VideoPlayer
      uri={'testVideo.mp4'}
      style={{ height: 1000 }}
      paused={false}
    />,
  ).snapshot();
});
