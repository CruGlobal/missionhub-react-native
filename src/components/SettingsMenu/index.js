import React, { Component } from 'react';
import { Alert, Linking } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { LINKS } from '../../constants';
import { isAndroid } from '../../utils/common';
import SideMenu from '../../components/SideMenu';
import {
  logout,
  upgradeAccount,
  upgradeAccountSignIn,
} from '../../actions/auth';
import { SIGNUP_TYPES } from '../../containers/UpgradeAccountScreen';

@translate('settingsMenu')
export class SettingsMenu extends Component {
  openUrl = async url => {
    const { t } = this.props;
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      // Can't handle url
      Alert.alert(t('cannotOpenUrl'), t('pleaseVisit', { url }));
      return;
    }

    Linking.openURL(url);
  };

  render() {
    const { t, dispatch, isFirstTime } = this.props;

    const upgradeAccountItems = [
      {
        label: t('signIn'),
        action: () => dispatch(upgradeAccountSignIn()),
      },
      {
        label: t('signUp'),
        action: () => dispatch(upgradeAccount(SIGNUP_TYPES.SETTINGS_MENU)),
      },
    ];
    const signOut = {
      label: t('signOut'),
      action: () => dispatch(logout()),
    };

    const menuItems = [
      {
        label: t('about'),
        action: () => this.openUrl(LINKS.about),
      },
      {
        label: t('help'),
        action: () => this.openUrl(LINKS.help),
      },
      {
        label: t('review'),
        action: () =>
          this.openUrl(isAndroid ? LINKS.playStore : LINKS.appleStore),
      },
      {
        label: t('privacy'),
        action: () => this.openUrl(LINKS.privacy),
      },
      {
        label: t('tos'),
        action: () => this.openUrl(LINKS.terms),
      },
      ...(isFirstTime ? upgradeAccountItems : [signOut]),
    ];

    return <SideMenu menuItems={menuItems} />;
  }
}

const mapStateToProps = ({ auth }) => ({
  isFirstTime: auth.isFirstTime,
});

export default connect(mapStateToProps)(SettingsMenu);
