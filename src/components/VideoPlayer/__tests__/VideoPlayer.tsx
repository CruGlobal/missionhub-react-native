import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import VideoPlayer from '../';

jest.mock('react-native-video', () => 'Video');

const onDelete = jest.fn();

describe('small screen', () => {
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

  it('renders with width', () => {
    renderWithContext(
      <VideoPlayer uri={'testVideo.mp4'} width={900} />,
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
});

describe('fullscreen', () => {
  it('renders not paused, unmuted', () => {
    const { getByTestId, snapshot } = renderWithContext(
      <VideoPlayer uri={'testVideo.mp4'} />,
    );

    fireEvent.press(getByTestId('PlayButton'));

    snapshot();
  });

  it('renders paused, unmuted', () => {
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <VideoPlayer uri={'testVideo.mp4'} />,
    );

    fireEvent.press(getByTestId('PlayButton'));

    recordSnapshot();

    fireEvent.press(getByTestId('PausePlayButton'));

    diffSnapshot();
  });

  it('renders not paused, muted', () => {
    const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
      <VideoPlayer uri={'testVideo.mp4'} />,
    );

    fireEvent.press(getByTestId('PlayButton'));

    recordSnapshot();

    fireEvent.press(getByTestId('MutedButton'));

    diffSnapshot();
  });

  it('returns to small screen', () => {
    const { getByTestId, snapshot } = renderWithContext(
      <VideoPlayer uri={'testVideo.mp4'} />,
    );

    fireEvent.press(getByTestId('PlayButton'));

    fireEvent.press(getByTestId('CloseButton'));

    snapshot();
  });
});
