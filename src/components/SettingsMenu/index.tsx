import React, { useEffect } from 'react';
import { Alert, Linking } from 'react-native';
import { connect } from 'react-redux-legacy';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch } from 'redux-thunk';

import { LINKS } from '../../constants';
import { isAndroid } from '../../utils/common';
import SideMenu from '../../components/SideMenu';
import { logout } from '../../actions/auth/auth';
import { trackScreenChange } from '../../actions/analytics';
import { SIGN_IN_FLOW, SIGN_UP_FLOW } from '../../routes/constants';
import { navigatePush } from '../../actions/navigation';
import { AuthState } from '../../reducers/auth';
import { DrawerState } from '../../reducers/drawer';

interface SettingsMenuProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, null, never>;
  isAnonymousUser: boolean;
  isOpen: boolean;
  mainScreenTracking: string | null;
}

const SettingsMenu = ({
  dispatch,
  isAnonymousUser,
  isOpen,
  mainScreenTracking,
}: SettingsMenuProps) => {
  const { t } = useTranslation('settingsMenu');
  useEffect(() => {
    if (isOpen) {
      dispatch(trackScreenChange('menu'));
    } else if (mainScreenTracking) {
      dispatch(trackScreenChange(mainScreenTracking));
    }
  }, [isOpen]);

  const openUrl = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      // Can't handle url
      Alert.alert(t('cannotOpenUrl'), t('pleaseVisit', { url }));
      return;
    }
    Linking.openURL(url);
  };
  const menuItems = [
    {
      label: t('about'),
      action: () => openUrl(LINKS.about),
    },
    {
      label: t('help'),
      action: () => openUrl(LINKS.help),
    },
    {
      label: t('shareStory'),
      action: () => openUrl(LINKS.shareStory),
    },
    {
      label: t('review'),
      action: () => openUrl(isAndroid ? LINKS.playStore : LINKS.appleStore),
    },
    {
      label: t('privacy'),
      action: () => openUrl(LINKS.privacy),
    },
    {
      label: t('tos'),
      action: () => openUrl(LINKS.terms),
    },
    ...(isAnonymousUser
      ? [
          {
            label: t('signIn'),
            action: () => dispatch(navigatePush(SIGN_IN_FLOW)),
          },
          {
            label: t('signUp'),
            action: () => dispatch(navigatePush(SIGN_UP_FLOW)),
          },
        ]
      : [
          {
            label: t('signOut'),
            action: () => dispatch(logout()),
          },
        ]),
  ];
  return <SideMenu testID="Menu" menuItems={menuItems} />;
};

const mapStateToProps = ({
  auth,
  drawer,
}: {
  auth: AuthState;
  drawer: DrawerState;
}) => ({
  isAnonymousUser: !!auth.upgradeToken,
  isOpen: drawer.isOpen,
  mainScreenTracking: drawer.mainScreenTracking,
});
export default connect(mapStateToProps)(SettingsMenu);
