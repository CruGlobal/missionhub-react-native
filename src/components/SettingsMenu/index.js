import React, { Component } from 'react';
import { Alert, Linking } from 'react-native';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { LINKS } from '../../constants';
import { isAndroid } from '../../utils/common';
import SideMenu from '../../components/SideMenu';
import { logout } from '../../actions/auth/auth';
import { SIGN_IN_FLOW, SIGN_UP_FLOW } from '../../routes/constants';
import { navigatePush } from '../../actions/navigation';

@withTranslation('settingsMenu')
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
        label: t('shareStory'),
        action: () => this.openUrl(LINKS.shareStory),
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
      // ...(isFirstTime
      //   ? [
      //       {
      //         label: t('signIn'),
      //         action: () => dispatch(navigatePush(SIGN_IN_FLOW)),
      //       },
      //       {
      //         label: t('signUp'),
      //         action: () => dispatch(navigatePush(SIGN_UP_FLOW)),
      //       },
      //     ]
      //   : [
      //       {
      //         label: t('signOut'),
      //         action: () => dispatch(logout()),
      //       },
      //     ]),
      ...[
        {
          label: t('signOut'),
          action: () => dispatch(logout()),
        },
      ],
    ];

    return <SideMenu menuItems={menuItems} />;
  }
}

const mapStateToProps = ({ auth }) => ({
  isFirstTime: auth.isFirstTime,
});

export default connect(mapStateToProps)(SettingsMenu);
