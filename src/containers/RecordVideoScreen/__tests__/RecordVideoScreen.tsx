import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';

import { RecordVideoScreen } from '..';

jest.mock('react-native-camera', () => 'Camera');

const onEndRecord = jest.fn();

it('renders pre-recording correctly', () => {
  const { snapshot } = renderWithContext(<RecordVideoScreen />, {
    navParams: { onEndRecord },
  });

  snapshot();
});

it('renders recording correctly', () => {
  const { getByTestId, snapshot } = renderWithContext(<RecordVideoScreen />, {
    navParams: { onEndRecord },
  });

  fireEvent.press(getByTestId('RecordButton'));

  snapshot();
});

it('times out after 15 seconds, ends recording and navigates back', async () => {
  const { getByTestId } = renderWithContext(<RecordVideoScreen />, {
    navParams: { onEndRecord },
  });

  fireEvent.press(getByTestId('RecordButton'));

  await flushMicrotasksQueue();

  expect(onEndRecord).toHaveBeenCalledWith();
});

it('ends recording and navigates back on pressing record button', () => {});

it('navigates back on pressing close button', () => {});

it('flips camera on pressing flip camera button', () => {});
