import React from 'react';
import { StatusBar, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';

import Header from '../../components/Header';
import { Button } from '../../components/common';
import { getAnalyticsPermissionType } from '../../utils/analytics';
import { ANALYTICS_PERMISSION_TYPE } from '../../constants';
import DeprecatedBackButton from '../DeprecatedBackButton';
import { navigateBack } from '../../actions/navigation';
import { organizationSelector } from '../../selectors/organizations';
import { CelebrateFeed } from '../CelebrateFeed';
import theme from '../../theme';
import { refreshCommunity } from '../../actions/organizations';
import {
  markCommentsRead,
  markCommentRead,
} from '../../actions/unreadComments';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { CommunityFeedItem } from '../../components/CommunityFeedItem/__generated__/CommunityFeedItem';
import { RootState } from '../../reducers';

import styles from './styles';

const GroupUnreadFeed = () => {
  const { t } = useTranslation('groupUnread');
  const dispatch = useDispatch();

  const communityId: string = useNavigationParam('communityId');
  const selectorOrg = useSelector(({ organizations }: RootState) =>
    organizationSelector({ organizations }, { orgId: communityId }),
  );

  const count = (selectorOrg.unread_comments_count || 0) as number;
  const analyticsPermissionType = useSelector(({ auth }: RootState) =>
    getAnalyticsPermissionType(auth, selectorOrg),
  );

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

export default GroupUnreadFeed;
export const GROUP_UNREAD_FEED_SCREEN = 'nav/GROUP_UNREAD_FEED_SCREEN';
