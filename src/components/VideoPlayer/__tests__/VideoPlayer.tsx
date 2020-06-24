import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import VideoPlayer from '../';

jest.mock('react-native-video', () => 'Video');

const onDelete = jest.fn();

it('renders correctly', () => {
  renderWithContext(<VideoPlayer uri={'testVideo.mp4'} />).snapshot();
});

it('renders with style', () => {
  renderWithContext(
    <VideoPlayer uri={'testVideo.mp4'} style={{ height: 1000 }} />,
  ).snapshot();
});

it('renders with delete button', () => {
  renderWithContext(
    <VideoPlayer
      uri={'testVideo.mp4'}
      style={{ height: 1000 }}
      onDelete={onDelete}
    />,
  ).snapshot();
});

it('calls onDelete', () => {
  const { getByTestId } = renderWithContext(
    <VideoPlayer
      uri={'testVideo.mp4'}
      style={{ height: 1000 }}
      onDelete={onDelete}
    />,
  );

  fireEvent.press(getByTestId('DeleteButton'));

  expect(onDelete).toHaveBeenCalledWith();
});
