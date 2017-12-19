import React, { Component } from 'react';
import { Linking } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { isAndroid } from '../../utils/common';
import SideMenu from '../../components/SideMenu';
import { logout } from '../../actions/auth';

@connect()
@translate('settingsMenu')
export default class SettingsMenu extends Component {
  render() {
    const { t } = this.props;
    const menuItems = [
      {
        label: t('about'),
        action: () => Linking.openURL('https://get.missionhub.com'),
      },
      {
        label: t('help'),
        action: () => Linking.openURL('http://help.missionhub.com'),
      },
      {
        label: t('review'),
        action: () => Linking.openURL(isAndroid ? 'market://details?id=com.missionhub' : 'itms://itunes.apple.com/us/app/apple-store/id447869440?mt=8'),
      },
      {
        label: t('terms'),
        action: () => Linking.openURL('https://get.missionhub.com/terms-of-service/'),
      },
      {
        label: t('privacy'),
        action: () => Linking.openURL('https://www.cru.org/us/en/about/privacy.html'),
      },
      {
        label: t('signOut'),
        action: () => this.props.dispatch(logout()),
      },
    ];

    return (
      <SideMenu menuItems={menuItems} />
    );
  }
}
