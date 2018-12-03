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
        action: () => this.props.dispatch(upgradeAccount()),
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
        label: t('terms'),
        action: () => Linking.openURL(LINKS.terms),
      },
    ];
    if (isFirstTime) {
      menuItems.concat(upgradeAccountItems);
    } else {
      menuItems.push(signOut);
    }

    return <SideMenu menuItems={menuItems} />;
  }
}

const mapStateToProps = ({ auth }) => ({
  isFirstTime: auth.isFirstTime,
});

export default connect(mapStateToProps)(SettingsMenu);
