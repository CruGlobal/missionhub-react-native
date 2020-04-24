import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { View, ScrollView } from 'react-native';

import Header from '../../components/Header';
import { IconButton } from '../../components/common';
import { openMainMenu } from '../../utils/common';
import SettingsIcon from '../../../assets/images/settingsIcon.svg';
import theme from '../../theme';

import styles from './styles';

const NotificationCenterScreen = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation('notificationsCenter');
  const onOpenMainMenu = () => dispatch(openMainMenu());
  return (
    <View style={styles.pageContainer}>
      <Header
        testID="header"
        left={
          <IconButton
            name="menuIcon"
            type="MissionHub"
            onPress={onOpenMainMenu}
          />
        }
        right={<SettingsIcon color={theme.white} style={{ marginRight: 10 }} />}
        title={t('title')}
        titleStyle={styles.title}
      />

      <ScrollView></ScrollView>
    </View>
  );
};

export default NotificationCenterScreen;
