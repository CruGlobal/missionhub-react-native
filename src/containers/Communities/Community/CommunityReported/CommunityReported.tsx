import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';

import { ContentComplaintGroupItem } from '../../../../components/NotificationCenterItem/__generated__/ContentComplaintGroupItem';
import Header from '../../../../components/Header';
import CloseButton, {
  CloseButtonTypeEnum,
} from '../../../../components/CloseButton';
import theme from '../../../../theme';

import styles from './styles';

const CommunityReportedScreen = () => {
  const { t } = useTranslation('communityReported');
  const event: ContentComplaintGroupItem = useNavigationParam('event');

  const reportedItemType =
    event?.subject.__typename === 'Post'
      ? t('reportedPost')
      : t('reportedComment');

  return (
    <View style={styles.container}>
      <Header
        style={styles.header}
        titleStyle={styles.title}
        title={reportedItemType}
        right={
          <CloseButton
            iconColor={theme.white}
            type={CloseButtonTypeEnum.thick}
          />
        }
      />
      <View style={styles.contentContainer}></View>
    </View>
  );
};

export default CommunityReportedScreen;

export const COMMUNITY_REPORTED = 'nav/COMMUNITY_REPORTED';
