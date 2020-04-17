import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { CREATE_POST_SCREEN } from '../../CreatePostScreen';
import { renderWithContext } from '../../../../../testUtils';
import { navigatePush, navigateBack } from '../../../../actions/navigation';
import { GLOBAL_COMMUNITY_ID } from '../../../../constants';

import { CreatePostButton } from '..';

jest.mock('../../../../actions/navigation');

const orgId = '1234';

const refreshItems = jest.fn();

beforeEach(() => {
  (navigatePush as jest.Mock).mockReturnValue({ type: 'navigate push' });
});

it('renders correctly', () => {
  renderWithContext(
    <CreatePostButton refreshItems={refreshItems} orgId={orgId} />,
  ).snapshot();
});

it('does not render for Global Community', () => {
  renderWithContext(
    <CreatePostButton
      refreshItems={refreshItems}
      orgId={GLOBAL_COMMUNITY_ID}
    />,
  ).snapshot();
});

it('onPress switches to NewPostScreen', () => {
  const { getByTestId } = renderWithContext(
    <CreatePostButton refreshItems={refreshItems} orgId={orgId} />,
  );

  fireEvent.press(getByTestId('CreatePostButton'));
  expect(navigatePush).toHaveBeenCalledWith(CREATE_POST_SCREEN, {
    orgId,
    onComplete: expect.any(Function),
  });
  (navigatePush as jest.Mock).mock.calls[0][1].onComplete();
  expect(refreshItems).toHaveBeenCalled();
  expect(navigateBack).toHaveBeenCalled();
});
