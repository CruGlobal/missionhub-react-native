import React from 'react';
import ReactNative from 'react-native';
import i18n from 'i18next';

import { renderWithContext } from '../../../../testUtils';
import { LINKS } from '../../../constants';
import {
  useAnalytics,
  ANALYTICS_SCREEN_TYPES,
} from '../../../utils/hooks/useAnalytics';
import { useGetAppVersion } from '../../../utils/hooks/useGetAppVersion';

import SettingsMenu from '..';

jest.mock('../../../utils/hooks/useAnalytics');
jest.mock('../../../utils/hooks/useIsMe');
jest.mock('../../../utils/hooks/useGetAppVersion');

beforeEach(() => {
  (useGetAppVersion as jest.Mock).mockReturnValue('5.4.1');
});

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

  expect(useAnalytics).toHaveBeenCalledWith('menu', {
    screenType: ANALYTICS_SCREEN_TYPES.drawer,
  });
});

it('renders correctly for try it now user', () => {
  renderWithContext(<SettingsMenu />, {
    initialState: getState(true),
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith('menu', {
    screenType: ANALYTICS_SCREEN_TYPES.drawer,
  });
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

    // Section 1
    expect(items[0].title).toEqual(i18n.t('settingsMenu:feedBack'));
    expect(items[0].data[0].label).toEqual(i18n.t('settingsMenu:shareStory'));
    expect(items[0].data[1].label).toEqual(i18n.t('settingsMenu:suggestStep'));
    expect(items[0].data[2].label).toEqual(i18n.t('settingsMenu:review'));
    // Section 2
    expect(items[1].title).toEqual(i18n.t('settingsMenu:about'));
    expect(items[1].data[0].label).toEqual(i18n.t('settingsMenu:blog'));
    expect(items[1].data[1].label).toEqual(i18n.t('settingsMenu:website'));
    expect(items[1].data[2].label).toEqual(i18n.t('settingsMenu:help'));
    expect(items[1].data[3].label).toEqual(i18n.t('settingsMenu:privacy'));
    expect(items[1].data[4].label).toEqual(i18n.t('settingsMenu:tos'));
  });

  it('should test link, then open it', async () => {
    ReactNative.Linking.canOpenURL = jest
      .fn()
      .mockReturnValue(Promise.resolve(true));

    const items = getMenuItems();

    const testUrl = async (section: number, index: number, url: string) => {
      await items[section].data[index].action();
      expect(ReactNative.Linking.canOpenURL).toHaveBeenCalledWith(url);
      expect(ReactNative.Linking.openURL).toHaveBeenCalledWith(url);
    };

    await testUrl(0, 0, LINKS.shareStory);
    await testUrl(0, 1, LINKS.shareStory);
    await testUrl(0, 2, LINKS.appleStore);
    await testUrl(1, 0, LINKS.blog);
    await testUrl(1, 1, LINKS.about);
    await testUrl(1, 2, LINKS.help);
    await testUrl(1, 3, LINKS.privacy);
    await testUrl(1, 4, LINKS.terms);
  });

  it('should not open link if it is not supported', async () => {
    ReactNative.Linking.canOpenURL = jest
      .fn()
      .mockReturnValue(Promise.resolve(false));

    const items = getMenuItems();

    await items[0].data[0].action();

    expect(ReactNative.Linking.canOpenURL).toHaveBeenCalledWith(
      LINKS.shareStory,
    );
    expect(ReactNative.Linking.openURL).not.toHaveBeenCalled();
  });
});
