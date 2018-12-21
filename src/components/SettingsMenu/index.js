import React, { Component } from 'react';
import { Linking } from 'react-native';
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
  render() {
    const { t, isFirstTime } = this.props;
    const upgradeAccountItems = [
      {
        label: t('signIn'),
        action: () => this.props.dispatch(upgradeAccountSignIn()),
      },
      {
        label: t('signUp'),
        action: () =>
          this.props.dispatch(upgradeAccount(SIGNUP_TYPES.SETTINGS_MENU)),
      },
    ];
    const signOut = {
      label: t('signOut'),
      action: () => this.props.dispatch(logout()),
    };

    const menuItems = [
      {
        label: t('about'),
        action: () => Linking.openURL(LINKS.about),
      },
      {
        label: t('help'),
        action: () => Linking.openURL(LINKS.help),
      },
      {
        label: t('review'),
        action: () =>
          Linking.openURL(isAndroid ? LINKS.playStore : LINKS.appleStore),
      },
      {
        label: t('privacy'),
        action: () => Linking.openURL(LINKS.privacy),
      },
      {
        label: t('tos'),
        action: () => Linking.openURL(LINKS.terms),
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
