import React, { Component } from 'react';
import { Linking } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { LINKS } from '../../constants';
import { isAndroid } from '../../utils/common';
import SideMenu from '../../components/SideMenu';
import { logout, upgradeAccount } from '../../actions/auth';

@translate('settingsMenu')
export class SettingsMenu extends Component {
  render() {
    const { t, isFirstTime } = this.props;
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
        action: () => Linking.openURL(isAndroid ? LINKS.playStore : LINKS.appleStore),
      },
      {
        label: t('terms'),
        action: () => Linking.openURL(LINKS.terms),
      },
      {
        label: isFirstTime ? t('signUp') : t('signOut'),
        action: () => {
          if (isFirstTime) {
            this.props.dispatch(upgradeAccount());
          } else {
            this.props.dispatch(logout());
          }
        },
      },
    ];

    return (
      <SideMenu menuItems={menuItems} />
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  isFirstTime: auth.isFirstTime,
});

export default connect(mapStateToProps)(SettingsMenu);
