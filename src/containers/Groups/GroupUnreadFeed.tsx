import React from 'react';
import { StatusBar, View } from 'react-native';
import { connect } from 'react-redux-legacy';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Header from '../../components/Header';
import { Button } from '../../components/common';
import { getAnalyticsPermissionType } from '../../utils/analytics';
import { ANALYTICS_PERMISSION_TYPE } from '../../constants';
import DeprecatedBackButton from '../DeprecatedBackButton';
import { TrackStateContext } from '../../actions/analytics';
import { navigateBack } from '../../actions/navigation';
import { organizationSelector } from '../../selectors/organizations';
import { CelebrateFeed } from '../CelebrateFeed';
import theme from '../../theme';
import { refreshCommunity } from '../../actions/organizations';
import { OrganizationsState, Organization } from '../../reducers/organizations';
import { AuthState } from '../../reducers/auth';
import {
  markCommentsRead,
  markCommentRead,
} from '../../actions/unreadComments';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { CommunityFeedItem } from '../../components/CommunityFeedItem/__generated__/CommunityFeedItem';

import styles from './styles';

export interface GroupUnreadFeedProps {
  communityId: string;
  count: number;
  analyticsPermissionType: TrackStateContext[typeof ANALYTICS_PERMISSION_TYPE];
}

const GroupUnreadFeed = ({
  communityId,
  count,
  analyticsPermissionType,
}: GroupUnreadFeedProps) => {
  const { t } = useTranslation('groupUnread');
  const dispatch = useDispatch();
  useAnalytics(['celebrate', 'new comment items'], {
    screenContext: { [ANALYTICS_PERMISSION_TYPE]: analyticsPermissionType },
  });

  const back = () => dispatch(navigateBack());

  const handleRefetch = () => dispatch(refreshCommunity(communityId));

  const markAllAsRead = async () => {
    await dispatch(markCommentsRead(communityId));
    back();
  };

  const handleClearNotification = (item: CommunityFeedItem) =>
    dispatch(markCommentRead(item.id, communityId));

  return (
    <View style={styles.pageContainer}>
      <StatusBar {...theme.statusBar.darkContent} />
      <Header
        left={<DeprecatedBackButton iconStyle={styles.backIcon} />}
        right={
          <Button
            testID="MarkAllButton"
            type="transparent"
            text={t('clearAll').toUpperCase()}
            style={styles.clearAllButton}
            buttonTextStyle={styles.clearAllButtonText}
            onPress={markAllAsRead}
          />
        }
        shadow={true}
        title={t('title', { count })}
        titleStyle={styles.unreadTitle}
      />
      <View style={styles.cardList}>
        <CelebrateFeed
          testID="CelebrateFeed"
          communityId={communityId}
          onRefetch={handleRefetch}
          itemNamePressable={true}
          noHeader={true}
          showUnreadOnly={true}
          onClearNotification={handleClearNotification}
        />
      </View>
    </View>
  );
};

const mapStateToProps = (
  {
    auth,
    organizations,
  }: { auth: AuthState; organizations: OrganizationsState },
  {
    navigation: {
      state: {
        params: { communityId },
      },
    },
  }: {
    navigation: {
      state: {
        params: { communityId: string };
      };
    };
  },
) => {
  const selectorOrg: Organization = organizationSelector(
    { organizations },
    { orgId: communityId },
  );

  return {
    count: (selectorOrg.unread_comments_count || 0) as number,
    analyticsPermissionType: getAnalyticsPermissionType(auth, selectorOrg),
  };
};

export default connect(mapStateToProps)(GroupUnreadFeed);
export const GROUP_UNREAD_FEED_SCREEN = 'nav/GROUP_UNREAD_FEED_SCREEN';
