import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { CELEBRATE_SHARE_STORY_SCREEN } from '../../ShareStoryScreen';
import { renderWithContext } from '../../../../../testUtils';
import { navigatePush } from '../../../../actions/navigation';

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

it('onPress switches to ShareStoryScreen', () => {
  const { getByTestId } = renderWithContext(<ShareStoryInput {...props} />);
  fireEvent.press(getByTestId('ShareStoryInput'));
  expect(navigatePush).toHaveBeenCalledWith(CELEBRATE_SHARE_STORY_SCREEN, {
    organization: mockOrganization,
    // jest.fn() does not work here and I can't figure out why
    onComplete: expect.any(Function),
  });
});
