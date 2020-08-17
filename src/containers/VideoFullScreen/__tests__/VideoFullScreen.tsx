import React from 'react';
import Video, { OnProgressData } from 'react-native-video';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { navigateBack } from '../../../actions/navigation';
import { VideoFullScreen } from '..';

jest.mock('../../../actions/navigation');

const uri = 'file:/video.mov';

beforeEach(() => {
  (navigateBack as jest.Mock).mockReturnValue(() => Promise.resolve());
});

it('renders correctly', () => {
  renderWithContext(<VideoFullScreen />, {
    navParams: { uri },
  }).snapshot();
});

it('sets video progress time', () => {
  const progress: OnProgressData = {
    currentTime: 3333,
    seekableDuration: 10000,
    playableDuration: 10000,
  };

  const { getByType, recordSnapshot, diffSnapshot } = renderWithContext(
    <VideoFullScreen />,
    {
      navParams: { uri },
    },
  );
  recordSnapshot();

  fireEvent(getByType(Video), 'onProgress', progress);

  diffSnapshot();
});

it('pauses video', () => {
  const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
    <VideoFullScreen />,
    {
      navParams: { uri },
    },
  );
  recordSnapshot();

  fireEvent.press(getByTestId('PausePlayButton'));

  diffSnapshot();
});

it('mutes video', () => {
  const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
    <VideoFullScreen />,
    {
      navParams: { uri },
    },
  );
  recordSnapshot();

  fireEvent.press(getByTestId('MutedButton'));

  diffSnapshot();
});

it('when video is finished, navigates back', () => {
  const { getByType } = renderWithContext(<VideoFullScreen />, {
    navParams: { uri },
  });

  fireEvent(getByType(Video), 'onEnd');

  expect(navigateBack).toHaveBeenCalledWith();
});

it('when close button is pressed, navigates back', () => {
  const { getByTestId } = renderWithContext(<VideoFullScreen />, {
    navParams: { uri },
  });

  fireEvent.press(getByTestId('CloseButton'));

  expect(navigateBack).toHaveBeenCalledWith();
});
