import React from 'react';
import { fireEvent } from 'react-native-testing-library';

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

it('renders correctly', () => {
  renderWithContext(<VideoPlayer uri={uri} />).snapshot();
});

it('renders with style', () => {
  renderWithContext(
    <VideoPlayer uri={uri} style={{ padding: 10 }} />,
  ).snapshot();
});

it('renders with delete button', () => {
  renderWithContext(
    <VideoPlayer uri={uri} style={{ height: 1000 }} onDelete={onDelete} />,
  ).snapshot();
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
