import React from 'react';
import { Alert, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';

import { LINKS } from '../../constants';
import { isAndroid } from '../../utils/common';
import SideMenu from '../../components/SideMenu';
import {
  useAnalytics,
  ANALYTICS_SCREEN_TYPES,
} from '../../utils/hooks/useAnalytics';

const SettingsMenu = () => {
  const { t } = useTranslation('settingsMenu');
  useAnalytics('menu', { screenType: ANALYTICS_SCREEN_TYPES.drawer });

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
      id: '1',
      title: t('feedBack'),
      data: [
        {
          label: t('shareStory'),
          action: () => openUrl(LINKS.shareStory),
        },
        {
          label: t('suggestStep'),
          action: () => openUrl(LINKS.shareStory),
        },
        {
          label: t('review'),
          action: () => openUrl(isAndroid ? LINKS.playStore : LINKS.appleStore),
        },
      ],
    },

    {
      id: '2',
      title: t('about'),
      data: [
        {
          label: t('blog'),
          action: () => openUrl(LINKS.blog),
        },
        {
          label: t('website'),
          action: () => openUrl(LINKS.about),
        },
        {
          label: t('help'),
          action: () => openUrl(LINKS.help),
        },

        {
          label: t('privacy'),
          action: () => openUrl(LINKS.privacy),
        },
        {
          label: t('tos'),
          action: () => openUrl(LINKS.terms),
        },
      ],
    },
  ];
  return <SideMenu testID="Menu" menuItems={menuItems} />;
};

export default SettingsMenu;
