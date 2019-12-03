import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { CELEBRATE_SHARE_STORY_SCREEN } from '../../ShareStoryScreen';
import { renderWithContext } from '../../../../../testUtils';
import { navigatePush, navigateBack } from '../../../../actions/navigation';

import ShareStoryInput from '..';

jest.mock('../../../../actions/navigation');

const mockOrganization = {
  id: '1234',
};

const props = {
  dispatch: jest.fn(response => Promise.resolve(response)),
  refreshItems: jest.fn(),
  organization: mockOrganization,
};

it('renders correctly', () => {
  renderWithContext(<ShareStoryInput {...props} />).snapshot();
});

it('onPress switches to ShareStoryScreen', async () => {
  const { getByTestId } = renderWithContext(<ShareStoryInput {...props} />);
  fireEvent.press(getByTestId('ShareStoryInput'));
  expect(navigatePush).toHaveBeenCalledWith(CELEBRATE_SHARE_STORY_SCREEN, {
    organization: mockOrganization,
    onComplete: expect.any(Function),
  });
  await (navigatePush as jest.Mock).mock.calls[0][1].onComplete();
  expect(props.refreshItems).toHaveBeenCalled();
  expect(navigateBack).toHaveBeenCalled();
});
