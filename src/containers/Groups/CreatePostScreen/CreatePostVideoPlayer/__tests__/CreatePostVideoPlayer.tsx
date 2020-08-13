import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../../../testUtils';
import { CreatePostVideoPlayer } from '..';

jest.mock('react-native-video', () => 'Video');

const uri = 'video.mov';
const onDelete = jest.fn();

it('renders correctly', () => {
  renderWithContext(
    <CreatePostVideoPlayer uri={uri} onDelete={onDelete} />,
  ).snapshot();
});

it('renders unpaused correctly', () => {
  const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
    <CreatePostVideoPlayer uri={uri} onDelete={onDelete} />,
  );
  recordSnapshot();

  fireEvent.press(getByTestId('PlayButton'));

  diffSnapshot();
});

it('calls onDelete', () => {
  const { getByTestId } = renderWithContext(
    <CreatePostVideoPlayer uri={uri} onDelete={onDelete} />,
  );

  fireEvent.press(getByTestId('DeleteButton'));

  expect(onDelete).toHaveBeenCalledWith();
});
