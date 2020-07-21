import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { BackHandler } from 'react-native';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
// eslint-disable-next-line import/default
import VersionCheck from 'react-native-version-check';

import { renderWithContext } from '../../../../testUtils';
import { useMyId } from '../../../utils/hooks/useIsMe';
import { GET_MY_AVATAR_AND_EMAIL } from '../queries';
import { EDIT_PERSON_FLOW } from '../../../routes/constants';
import { navigatePush } from '../../../actions/navigation';
import { useGetAppVersion } from '../../../utils/hooks/useGetAppVersion';

import SideMenu from '..';

jest.mock('../../../utils/hooks/useIsMe');
jest.mock('../../../utils/hooks/useGetAppVersion');
jest.mock('react-native-version-check');
jest.mock('../../../actions/navigation');

const action = jest.fn();

const mockMenuItems = [
  {
    id: '1',
    title: 'Feedback',
    data: [
      { label: 'Share a God Story', action, selected: false },
      { label: 'Suggest a Step of Faith', action },
      { label: 'Enjoying our app? Rate it', action },
    ],
  },
  {
    id: '2',
    title: 'About',
    data: [
      { label: 'MissionHub Blog', action },
      { label: 'MissionHub Website', action },
      { label: 'Help', action },
      { label: 'Privacy Policy', action },
      { label: 'Terms of Service', action },
    ],
  },
];
jest.mock('../../IconButton', () => 'IconButton');
jest.mock('react-navigation-drawer', () => ({
  DrawerActions: {
    closeDrawer: jest.fn(() => ({ type: 'drawer closed' })),
  },
}));

const mockMyId = '1234';

beforeEach(() => {
  (useGetAppVersion as jest.Mock).mockReturnValue('5.4.1');
  (navigatePush as jest.Mock).mockReturnValue({ type: 'navigate push' });
  (useMyId as jest.Mock).mockReturnValue(mockMyId);
  (VersionCheck.getLatestVersion as jest.Mock).mockReturnValue('5.4.1');
});

it('renders correctly | Authenticated User', () => {
  const { snapshot } = renderWithContext(
    <SideMenu menuItems={mockMenuItems} />,
    {
      initialState: { drawer: { isOpen: false }, auth: { upgradeToken: true } },
    },
  );
  snapshot();
  expect(useQuery).toHaveBeenCalledWith(GET_MY_AVATAR_AND_EMAIL);
});

it('renders correctly | UnAuthed User', () => {
  const { snapshot } = renderWithContext(
    <SideMenu menuItems={mockMenuItems} />,
    {
      initialState: {
        drawer: { isOpen: false },
        auth: { upgradeToken: false },
      },
    },
  );
  snapshot();
});

it('render update button', async () => {
  (useGetAppVersion as jest.Mock).mockReturnValue('5.4.0');

  const { snapshot } = renderWithContext(
    <SideMenu menuItems={mockMenuItems} />,
    {
      initialState: {
        drawer: { isOpen: false },
        auth: { upgradeToken: false },
      },
    },
  );
  await flushMicrotasksQueue();
  snapshot();
  expect(useQuery).toHaveBeenCalledWith(GET_MY_AVATAR_AND_EMAIL);
});

it('finds the close button', () => {
  (BackHandler.addEventListener as jest.Mock) = jest.fn((_, callback) => {
    callback();
  });
  const { getByTestId } = renderWithContext(
    <SideMenu menuItems={mockMenuItems} />,
    {
      initialState: { drawer: { isOpen: false }, auth: { upgradeToken: true } },
    },
  );
  expect(getByTestId('CloseButton')).toBeTruthy();
  expect(BackHandler.addEventListener).toHaveBeenCalled();
});

it('should navigate to edit profile', async () => {
  const { getByTestId } = renderWithContext(
    <SideMenu menuItems={mockMenuItems} />,
    {
      initialState: { drawer: { isOpen: false }, auth: { upgradeToken: true } },
    },
  );
  await fireEvent.press(getByTestId('editButton'));
  expect(navigatePush).toHaveBeenCalledWith(EDIT_PERSON_FLOW, {
    person: { id: mockMyId },
  });
});

it('should open link to play or app store when user presses update button', async () => {
  (useGetAppVersion as jest.Mock).mockReturnValue('5.4.0');

  const { getByTestId } = renderWithContext(
    <SideMenu menuItems={mockMenuItems} />,
    {
      initialState: { drawer: { isOpen: false }, auth: { upgradeToken: true } },
    },
  );
  await flushMicrotasksQueue();
  await fireEvent.press(getByTestId('updateButton'));
  expect(mockMenuItems[0].data[2].action).toHaveBeenCalledWith();
});

it('should fire closedDrawer', async () => {
  const closedDrawerValue = [{ type: 'drawer closed' }];
  const { getByTestId, store } = renderWithContext(
    <SideMenu menuItems={mockMenuItems} />,
    {
      initialState: { drawer: { isOpen: false }, auth: { upgradeToken: true } },
    },
  );
  await fireEvent.press(getByTestId('CloseButton'));
  expect(store.getActions()).toEqual(closedDrawerValue);
});

it('unmounts and expect closeDrawer to fire if drawer is open', () => {
  const closedDrawerValue = [{ type: 'drawer closed' }];
  BackHandler.removeEventListener = jest.fn();
  const { unmount, store } = renderWithContext(
    <SideMenu menuItems={mockMenuItems} />,
    {
      initialState: { drawer: { isOpen: true }, auth: { upgradeToken: true } },
    },
  );
  unmount();
  expect(BackHandler.removeEventListener).toHaveBeenCalled();
  expect(store.getActions()).toEqual(closedDrawerValue);
});

it('unmounts and expect closeDrawer to not fire if drawer is not open', () => {
  BackHandler.removeEventListener = jest.fn();
  const { unmount, store } = renderWithContext(
    <SideMenu menuItems={mockMenuItems} />,
    {
      initialState: { drawer: { isOpen: false }, auth: { upgradeToken: true } },
    },
  );
  unmount();
  expect(BackHandler.removeEventListener).toHaveBeenCalled();
  expect(store.getActions()).toEqual([]);
});
