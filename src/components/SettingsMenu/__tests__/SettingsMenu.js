import React from 'react';
import ReactNative from 'react-native';

import {
  createMockStore,
  testSnapshotShallow,
  renderShallow,
} from '../../../../testUtils';
import { LINKS } from '../../../constants';
import i18n from '../../../i18n';

import SettingsMenu from '..';

const mockState = {
  auth: { isFirstTime: false },
};

const store = createMockStore(mockState);
it('renders correctly', () => {
  testSnapshotShallow(<SettingsMenu />, store);
});

describe('menu items and links', () => {
  let component;

  beforeEach(() => {
    ReactNative.Linking.openURL = jest.fn();
    component = renderShallow(<SettingsMenu />, store);
  });

  it('links are ordered correctly', () => {
    const items = component.props().menuItems;

    expect(items[0].label).toEqual(i18n.t('settingsMenu:about'));
    expect(items[1].label).toEqual(i18n.t('settingsMenu:help'));
    expect(items[2].label).toEqual(i18n.t('settingsMenu:review'));
    expect(items[3].label).toEqual(i18n.t('settingsMenu:privacy'));
    expect(items[4].label).toEqual(i18n.t('settingsMenu:terms'));
    expect(items[5].label).toEqual(i18n.t('settingsMenu:signOut'));
  });

  it('should test link, then open it', async () => {
    ReactNative.Linking.canOpenURL = jest
      .fn()
      .mockReturnValue(Promise.resolve(true));

    const items = component.props().menuItems;

    await items[0].action();
    expect(ReactNative.Linking.canOpenURL).toHaveBeenCalledWith(LINKS.about);
    expect(ReactNative.Linking.openURL).toHaveBeenCalledWith(LINKS.about);
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
