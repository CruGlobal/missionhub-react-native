import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { fireEvent } from 'react-native-testing-library';

import { openMainMenu } from '../../../utils/common';
import { GET_CURRENT_USER_AVATAR } from '../queries';
import AvatarMenuButton from '..';

import { renderWithContext } from '.../../../testUtils';

jest.mock('../../../utils/common');

beforeEach(() => {
  (openMainMenu as jest.Mock).mockReturnValue({ type: 'open main menu' });
});

it('renders correctly', () => {
  renderWithContext(<AvatarMenuButton />).snapshot();
  expect(useQuery).toHaveBeenCalledWith(GET_CURRENT_USER_AVATAR, {
    fetchPolicy: 'cache-first',
  });
});

it('fires handlePress on click', async () => {
  const { getByTestId } = renderWithContext(<AvatarMenuButton />);
  await fireEvent.press(getByTestId('menuButton'));
  expect(openMainMenu).toHaveBeenCalled();
});
