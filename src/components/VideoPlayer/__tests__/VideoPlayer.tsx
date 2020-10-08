import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { navigatePush } from '../../../actions/navigation';
import { VIDEO_FULL_SCREEN } from '../../../containers/VideoFullScreen';
import VideoPlayer from '../';

jest.mock('../../../actions/navigation');

beforeEach(() => {
  (navigatePush as jest.Mock).mockReturnValue(() => Promise.resolve());
});

const uri = 'testVideo.mp4';
const onDelete = jest.fn();

it('renders correctly', async () => {
  const { getByTestId, snapshot } = renderWithContext(
    <VideoPlayer uri={uri} />,
  );

  fireEvent(getByTestId('Video'), 'onLoad', {
    naturalSize: { width: 200, height: 100 },
  });

  await flushMicrotasksQueue();

  snapshot();
});

it('renders with style', async () => {
  const { getByTestId, snapshot } = renderWithContext(
    <VideoPlayer uri={uri} style={{ padding: 10 }} />,
  );

  fireEvent(getByTestId('Video'), 'onLoad', {
    naturalSize: { width: 200, height: 100 },
  });

  await flushMicrotasksQueue();

  snapshot();
});

it('renders with delete button', async () => {
  const { getByTestId, snapshot } = renderWithContext(
    <VideoPlayer uri={uri} style={{ height: 1000 }} onDelete={onDelete} />,
  );

  fireEvent(getByTestId('Video'), 'onLoad', {
    naturalSize: { width: 200, height: 100 },
  });

  await flushMicrotasksQueue();

  snapshot();
});

it('renders with width', async () => {
  const { getByTestId, snapshot } = renderWithContext(
    <VideoPlayer uri={uri} width={900} />,
  );

  fireEvent(getByTestId('Video'), 'onLoad', {
    naturalSize: { width: 200, height: 100 },
  });

  await flushMicrotasksQueue();

  snapshot();
});

it('calls onDelete', () => {
  const { getByTestId } = renderWithContext(
    <VideoPlayer uri={uri} style={{ height: 1000 }} onDelete={onDelete} />,
  );

  fireEvent.press(getByTestId('DeleteButton'));

  expect(onDelete).toHaveBeenCalledWith();
});

it('navigates to VideoFullScreen', () => {
  const { getByTestId } = renderWithContext(
    <VideoPlayer uri={uri} onDelete={onDelete} />,
  );

  fireEvent.press(getByTestId('ControlsWrap'));

  expect(navigatePush).toHaveBeenCalledWith(VIDEO_FULL_SCREEN, { uri });
});
