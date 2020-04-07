import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { CELEBRATE_SHARE_STORY_SCREEN } from '../../ShareStoryScreen';
import { renderWithContext } from '../../../../../testUtils';
import { navigatePush, navigateBack } from '../../../../actions/navigation';
import { GLOBAL_COMMUNITY_ID } from '../../../../constants';

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

const globalCommunityProps = {
  ...props,
  organization: {
    id: GLOBAL_COMMUNITY_ID,
  },
};

it('renders correctly', () => {
  renderWithContext(<ShareStoryInput {...props} />).snapshot();
});

it('does not render for Global Community', () => {
  renderWithContext(<ShareStoryInput {...globalCommunityProps} />).snapshot();
});

it('onPress switches to ShareStoryScreen', () => {
  const { getByTestId } = renderWithContext(<ShareStoryInput {...props} />);
  fireEvent.press(getByTestId('ShareStoryInput'));
  expect(navigatePush).toHaveBeenCalledWith(CELEBRATE_SHARE_STORY_SCREEN, {
    organization: mockOrganization,
    onComplete: expect.any(Function),
  });
  (navigatePush as jest.Mock).mock.calls[0][1].onComplete();
  expect(props.refreshItems).toHaveBeenCalled();
  expect(navigateBack).toHaveBeenCalled();
});
