import React from 'react';
import ReactNative from 'react-native';
import i18n from 'i18next';

import { renderWithContext } from '../../../../testUtils';
import { LINKS } from '../../../constants';
import {
  useAnalytics,
  ANALYTICS_SCREEN_TYPES,
} from '../../../utils/hooks/useAnalytics';

import SettingsMenu from '..';

jest.mock('../../../utils/hooks/useAnalytics');

function getState(isAnonymousUser: boolean) {
  return {
    drawer: { isOpen: false },
    auth: { upgradeToken: isAnonymousUser },
  };
}

it('renders correctly for authenticated user', () => {
  renderWithContext(<SettingsMenu />, {
    initialState: getState(false),
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(
    'menu',
    ANALYTICS_SCREEN_TYPES.drawer,
  );
});

it('renders correctly for try it now user', () => {
  renderWithContext(<SettingsMenu />, {
    initialState: getState(true),
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(
    'menu',
    ANALYTICS_SCREEN_TYPES.drawer,
  );
});

describe('menu items and links', () => {
  function getMenuItems() {
    const { getByTestId } = renderWithContext(<SettingsMenu />, {
      initialState: getState(false),
    });
    return getByTestId('Menu').props.menuItems;
  }

  beforeEach(() => {
    ReactNative.Linking.openURL = jest.fn();
  });

  it('links are ordered correctly', () => {
    const items = getMenuItems();

    expect(items[0].label).toEqual(i18n.t('settingsMenu:about'));
    expect(items[1].label).toEqual(i18n.t('settingsMenu:help'));
    expect(items[2].label).toEqual(i18n.t('settingsMenu:shareStory'));
    expect(items[3].label).toEqual(i18n.t('settingsMenu:review'));
    expect(items[4].label).toEqual(i18n.t('privacy'));
    expect(items[5].label).toEqual(i18n.t('tos'));
    expect(items[6].label).toEqual(i18n.t('settingsMenu:signOut'));
  });

  it('should test link, then open it', async () => {
    ReactNative.Linking.canOpenURL = jest
      .fn()
      .mockReturnValue(Promise.resolve(true));

    const items = getMenuItems();

    const testUrl = async (index: number, url: string) => {
      await items[index].action();
      expect(ReactNative.Linking.canOpenURL).toHaveBeenCalledWith(url);
      expect(ReactNative.Linking.openURL).toHaveBeenCalledWith(url);
    };

    await testUrl(0, LINKS.about);
    await testUrl(1, LINKS.help);
    await testUrl(2, LINKS.shareStory);
    await testUrl(3, LINKS.appleStore);
    await testUrl(4, LINKS.privacy);
    await testUrl(5, LINKS.terms);
  });

  it('should not open link if it is not supported', async () => {
    ReactNative.Linking.canOpenURL = jest
      .fn()
      .mockReturnValue(Promise.resolve(false));

    const items = getMenuItems();

    await items[0].action();

    expect(ReactNative.Linking.canOpenURL).toHaveBeenCalledWith(LINKS.about);
    expect(ReactNative.Linking.openURL).not.toHaveBeenCalled();
  });
});
