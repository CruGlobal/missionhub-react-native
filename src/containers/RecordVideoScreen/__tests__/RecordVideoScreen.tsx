import React from 'react';
//eslint-disable-next-line import/named
import { RNCamera } from 'react-native-camera';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { navigateBack } from '../../../actions/navigation';

import { RecordVideoScreen } from '..';

jest.mock('../../../actions/navigation');

const uri = 'file:/video.mov';

const onEndRecord = jest.fn();
const recordAsync = jest.fn().mockReturnValue({ uri });

const navigateBackResult = { type: 'navigate back' };

beforeEach(() => {
  (navigateBack as jest.Mock).mockReturnValue(navigateBackResult);
});

it('renders pre-recording correctly', () => {
  renderWithContext(<RecordVideoScreen />, {
    navParams: { onEndRecord },
  }).snapshot();
});

it('renders recording correctly', () => {
  const { getByType, snapshot } = renderWithContext(<RecordVideoScreen />, {
    navParams: { onEndRecord },
  });

  fireEvent(getByType(RNCamera), 'onRecordingStart');

  snapshot();
});

it('times out after 15 seconds, ends recording and navigates back', async () => {
  const { getByTestId, getByType } = renderWithContext(<RecordVideoScreen />, {
    navParams: { onEndRecord },
  });

  await flushMicrotasksQueue();

  fireEvent.press(getByTestId('RecordButton'));

  await flushMicrotasksQueue();

  expect(getByType(RNCamera).instance.recordAsync).toHaveBeenCalledWith({
    maxDuration: 15,
  });
  expect(onEndRecord).toHaveBeenCalledWith('file:/video.mov');
  expect(navigateBack).toHaveBeenCalledWith();
});

it('ends recording and navigates back on pressing record button', async () => {
  const { getByTestId, getByType } = renderWithContext(<RecordVideoScreen />, {
    navParams: { onEndRecord },
  });

  await flushMicrotasksQueue();

  fireEvent.press(getByTestId('RecordButton'));
  fireEvent.press(getByTestId('RecordButton'));

  expect(getByType(RNCamera).instance.stopRecording).toHaveBeenCalledWith();
});

it('navigates back on pressing close button', () => {
  const { getByTestId } = renderWithContext(<RecordVideoScreen />, {
    navParams: { onEndRecord },
  });

  fireEvent.press(getByTestId('CloseButton'));

  expect(navigateBack).toHaveBeenCalledWith();
});

it('flips camera on pressing flip camera button', () => {
  const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
    <RecordVideoScreen />,
    {
      navParams: { onEndRecord },
    },
  );

  recordSnapshot();

  fireEvent.press(getByTestId('FlipCameraButton'));

  diffSnapshot();
});
