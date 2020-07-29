import React from 'react';
import ReactNative, { BackHandler } from 'react-native';
import i18n from 'i18next';
import { useQuery } from '@apollo/react-hooks';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import DeviceInfo from 'react-native-device-info';

import { renderWithContext } from '../../../../testUtils';
import { useMyId } from '../../../utils/hooks/useIsMe';
import { GET_MY_AVATAR_AND_EMAIL } from '../queries';
import { EDIT_PERSON_FLOW } from '../../../routes/constants';
import { navigatePush } from '../../../actions/navigation';
import { useCheckForUpdate } from '../../../utils/hooks/useCheckForUpdate';
import { LINKS } from '../../../constants';
import {
  useAnalytics,
  ANALYTICS_SCREEN_TYPES,
} from '../../../utils/hooks/useAnalytics';
import SideMenu from '..';

jest.mock('../../../utils/hooks/useIsMe');
jest.mock('../../../utils/hooks/useCheckForUpdate');
jest.mock('../../../actions/navigation');
jest.mock('../../../utils/hooks/useAnalytics');
jest.mock('react-native-device-info');

jest.mock('../../IconButton', () => 'IconButton');
jest.mock('react-navigation-drawer', () => ({
  DrawerActions: {
    closeDrawer: jest.fn(() => ({ type: 'drawer closed' })),
  },
}));

const mockMyId = '1234';

beforeEach(() => {
  (useCheckForUpdate as jest.Mock).mockReturnValue(false);
  (DeviceInfo.getVersion as jest.Mock).mockReturnValue('5.4.1');
  (navigatePush as jest.Mock).mockReturnValue({ type: 'navigate push' });
  (useMyId as jest.Mock).mockReturnValue(mockMyId);
  ReactNative.Linking.openURL = jest.fn().mockReturnValue(Promise.resolve());
  ReactNative.Linking.canOpenURL = jest
    .fn()
    .mockReturnValue(Promise.resolve(true));
});

it('renders correctly | Authenticated User', () => {
  const { snapshot } = renderWithContext(<SideMenu />, {
    initialState: { drawer: { isOpen: false }, auth: { upgradeToken: true } },
  });
  snapshot();
  expect(useQuery).toHaveBeenCalledWith(GET_MY_AVATAR_AND_EMAIL);
  expect(useAnalytics).toHaveBeenCalledWith('menu', {
    screenType: ANALYTICS_SCREEN_TYPES.drawer,
  });
});

it('renders correctly | UnAuthed User', () => {
  const { snapshot } = renderWithContext(<SideMenu />, {
    initialState: {
      drawer: { isOpen: false },
      auth: { upgradeToken: false },
    },
  });
  snapshot();
});

it('render update button', async () => {
  (useCheckForUpdate as jest.Mock).mockReturnValue(true);
  (DeviceInfo.getVersion as jest.Mock).mockReturnValue('5.4.0');

  const { snapshot } = renderWithContext(<SideMenu />, {
    initialState: {
      drawer: { isOpen: false },
      auth: { upgradeToken: false },
    },
  });
  await flushMicrotasksQueue();
  snapshot();
  expect(useQuery).toHaveBeenCalledWith(GET_MY_AVATAR_AND_EMAIL);
});

it('finds the close button', () => {
  (BackHandler.addEventListener as jest.Mock) = jest.fn((_, callback) => {
    callback();
  });
  const { getByTestId } = renderWithContext(<SideMenu />, {
    initialState: { drawer: { isOpen: false }, auth: { upgradeToken: true } },
  });
  expect(getByTestId('CloseButton')).toBeTruthy();
  expect(BackHandler.addEventListener).toHaveBeenCalled();
});

it('should navigate to edit profile', async () => {
  const { getByTestId } = renderWithContext(<SideMenu />, {
    initialState: { drawer: { isOpen: false }, auth: { upgradeToken: true } },
  });
  await fireEvent.press(getByTestId('editButton'));
  expect(navigatePush).toHaveBeenCalledWith(EDIT_PERSON_FLOW, {
    person: { id: mockMyId },
  });
});

it('should open link to play or app store when user presses update button', async () => {
  (useCheckForUpdate as jest.Mock).mockReturnValue(true);

  const { getByTestId } = renderWithContext(<SideMenu />, {
    initialState: { drawer: { isOpen: false }, auth: { upgradeToken: true } },
  });
  await flushMicrotasksQueue();
  await fireEvent.press(getByTestId('updateButton'));
  expect(ReactNative.Linking.openURL).toHaveBeenCalledWith(LINKS.appleStore);
});

it('should fire closedDrawer', async () => {
  const closedDrawerValue = [{ type: 'drawer closed' }];
  const { getByTestId, store } = renderWithContext(<SideMenu />, {
    initialState: { drawer: { isOpen: false }, auth: { upgradeToken: true } },
  });
  await fireEvent.press(getByTestId('CloseButton'));
  expect(store.getActions()).toEqual(closedDrawerValue);
});

it('unmounts and expect closeDrawer to fire if drawer is open', () => {
  const closedDrawerValue = [{ type: 'drawer closed' }];
  BackHandler.removeEventListener = jest.fn();
  const { unmount, store } = renderWithContext(<SideMenu />, {
    initialState: { drawer: { isOpen: true }, auth: { upgradeToken: true } },
  });
  unmount();
  expect(BackHandler.removeEventListener).toHaveBeenCalled();
  expect(store.getActions()).toEqual(closedDrawerValue);
});

it('unmounts and expect closeDrawer to not fire if drawer is not open', () => {
  BackHandler.removeEventListener = jest.fn();
  const { unmount, store } = renderWithContext(<SideMenu />, {
    initialState: { drawer: { isOpen: false }, auth: { upgradeToken: true } },
  });
  unmount();
  expect(BackHandler.removeEventListener).toHaveBeenCalled();
  expect(store.getActions()).toEqual([]);
});

describe('menu items and links', () => {
  function getMenuButton(text: string) {
    const { getByText } = renderWithContext(<SideMenu />, {
      initialState: { drawer: { isOpen: false }, auth: { upgradeToken: true } },
    });
    return getByText(text);
  }
  const testUrl = (text: string, url: string) => {
    jest.useFakeTimers();
    fireEvent.press(getMenuButton(text));
    // To fix issue with debounce on button press
    jest.runAllTimers();

    expect(ReactNative.Linking.canOpenURL).toHaveBeenCalledWith(url);
    expect(ReactNative.Linking.openURL).toHaveBeenCalledWith(url);
  };

  it('should test link, then open it | shareStory', async () => {
    await testUrl(i18n.t('sideMenu:shareStory'), LINKS.shareStory);
    expect.hasAssertions();
  });
  it('should test link, then open it | suggestStep', async () => {
    await testUrl(i18n.t('sideMenu:suggestStep'), LINKS.suggestStep);
    expect.hasAssertions();
  });
  it('should test link, then open it | shareStory', async () => {
    await testUrl(i18n.t('sideMenu:review'), LINKS.appleStore);
    expect.hasAssertions();
  });
  it('should test link, then open it | blog', async () => {
    await testUrl(i18n.t('sideMenu:blog'), LINKS.blog);
    expect.hasAssertions();
  });
  it('should test link, then open it | about', async () => {
    await testUrl(i18n.t('sideMenu:website'), LINKS.about);
    expect.hasAssertions();
  });
  it('should test link, then open it | help', async () => {
    await testUrl(i18n.t('sideMenu:help'), LINKS.help);
    expect.hasAssertions();
  });
  it('should test link, then open it | privacy', async () => {
    await testUrl(i18n.t('sideMenu:privacy'), LINKS.privacy);
    expect.hasAssertions();
  });
  it('should test link, then open it | tos', async () => {
    await testUrl(i18n.t('sideMenu:tos'), LINKS.terms);
    expect.hasAssertions();
  });

  it('should not open link if it is not supported', async () => {
    ReactNative.Linking.canOpenURL = jest
      .fn()
      .mockReturnValue(Promise.resolve(false));
    jest.useFakeTimers();

    await fireEvent.press(getMenuButton(i18n.t('sideMenu:shareStory')));
    // To fix issue with debounce on button press
    jest.runAllTimers();
    expect(ReactNative.Linking.canOpenURL).toHaveBeenCalledWith(
      LINKS.shareStory,
    );
    expect(ReactNative.Linking.openURL).not.toHaveBeenCalled();
  });
});
