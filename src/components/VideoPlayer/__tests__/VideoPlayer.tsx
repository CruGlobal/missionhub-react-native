import React from 'react';

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
