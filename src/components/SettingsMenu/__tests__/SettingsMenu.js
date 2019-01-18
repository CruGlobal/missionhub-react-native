import React from 'react';
import ReactNative from 'react-native';

import {
  createMockStore,
  testSnapshotShallow,
  renderShallow,
} from '../../../../testUtils';
import { LINKS } from '../../../constants';

import i18n from 'i18next';

import SettingsMenu from '..';

it('renders correctly for authenticated user', () => {
  const mockState = {
    auth: { isFirstTime: false },
  };
  const store = createMockStore(mockState);
  testSnapshotShallow(<SettingsMenu />, store);
});

it('renders correctly for try it now user', () => {
  const mockState = {
    auth: { isFirstTime: true },
  };
  const store = createMockStore(mockState);
  testSnapshotShallow(<SettingsMenu />, store);
});

describe('menu items and links', () => {
  let component;
  const mockState = {
    auth: { isFirstTime: false },
  };
  const store = createMockStore(mockState);

  beforeEach(() => {
    ReactNative.Linking.openURL = jest.fn();
    component = renderShallow(<SettingsMenu />, store);
  });

  it('links are ordered correctly', () => {
    const items = component.props().menuItems;

    expect(items[0].label).toEqual(i18n.t('settingsMenu:about'));
    expect(items[1].label).toEqual(i18n.t('settingsMenu:help'));
    expect(items[2].label).toEqual(i18n.t('settingsMenu:review'));
    expect(items[3].label).toEqual(i18n.t('privacy'));
    expect(items[4].label).toEqual(i18n.t('tos'));
    expect(items[5].label).toEqual(i18n.t('settingsMenu:signOut'));
  });

  it('should test link, then open it', async () => {
    ReactNative.Linking.canOpenURL = jest
      .fn()
      .mockReturnValue(Promise.resolve(true));

    const items = component.props().menuItems;

    const testUrl = async (index, url) => {
      await items[index].action();
      expect(ReactNative.Linking.canOpenURL).toHaveBeenCalledWith(url);
      expect(ReactNative.Linking.openURL).toHaveBeenCalledWith(url);
    };

    await testUrl(0, LINKS.about);
    await testUrl(1, LINKS.help);
    await testUrl(2, LINKS.appleStore);
    await testUrl(3, LINKS.privacy);
    await testUrl(4, LINKS.terms);
  });

  it('should not open link if it is not supported', async () => {
    ReactNative.Linking.canOpenURL = jest
      .fn()
      .mockReturnValue(Promise.resolve(false));

    const items = component.props().menuItems;

    await items[0].action();

    expect(ReactNative.Linking.canOpenURL).toHaveBeenCalledWith(LINKS.about);
    expect(ReactNative.Linking.openURL).not.toHaveBeenCalled();
  });
});
