import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';
import { useQuery } from '@apollo/react-hooks';

import Header from '../../../../components/Header';
import CloseButton, {
  CloseButtonTypeEnum,
} from '../../../../components/CloseButton';
import ReportedItem from '../../../../containers/ReportedItem';

import theme from '../../../../theme';

import styles from './styles';
import { GET_CONTENT_COMPLAINT } from './queries';
import {
  GetContentComplaint,
  GetContentComplaintVariables,
} from './__generated__/GetContentComplaint';

const CommunityReportedScreen = () => {
  const { t } = useTranslation('communityReported');
  const reportedItemId = useNavigationParam('reportedItemId');

  const { data: { contentComplaint } = {} } = useQuery<
    GetContentComplaint,
    GetContentComplaintVariables
  >(GET_CONTENT_COMPLAINT, {
    variables: {
      id: reportedItemId,
    },
  });
  const reportedItemType = contentComplaint?.subject.__typename;

  const reportedTitle =
    reportedItemType === 'Post' ? t('reportedPost') : t('reportedComment');

  if (
    contentComplaint &&
    reportedItemType !== 'Post' &&
    reportedItemType !== 'FeedItemComment'
  ) {
    throw new Error(
      'Subject type of ReportedItem passed to ReportedNotificationCenterItem must be either a Post or FeedItemComment',
    );
  }

  return (
    <View style={styles.container}>
      <Header
        style={styles.header}
        titleStyle={styles.title}
        title={reportedTitle}
        right={
          <CloseButton
            iconColor={theme.white}
            type={CloseButtonTypeEnum.thick}
          />
        }
      />
      <View style={styles.contentContainer}>
        {contentComplaint ? (
          <ReportedItem reportedItem={contentComplaint} />
        ) : null}
      </View>
    </View>
  );
};

export default CommunityReportedScreen;

export const COMMUNITY_REPORTED = 'nav/COMMUNITY_REPORTED';
