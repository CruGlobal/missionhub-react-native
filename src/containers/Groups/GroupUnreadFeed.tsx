import React from 'react';
import { StatusBar, View } from 'react-native';
import { connect, useDispatch } from 'react-redux-legacy';
import { useTranslation } from 'react-i18next';

import Header from '../../components/Header';
import { Button } from '../../components/common';
import { getAnalyticsPermissionType } from '../../utils/common';
import { ANALYTICS_PERMISSION_TYPE } from '../../constants';
import BackButton from '../BackButton';
import { TrackStateContext } from '../../actions/analytics';
import { navigateBack } from '../../actions/navigation';
import { organizationSelector } from '../../selectors/organizations';
import { orgPermissionSelector } from '../../selectors/people';
import CelebrateFeed from '../CelebrateFeed';
import theme from '../../theme';
import { refreshCommunity } from '../../actions/organizations';
import { OrganizationsState, Organization } from '../../reducers/organizations';
import { AuthState } from '../../reducers/auth';
import {
  markCommentsRead,
  markCommentRead,
} from '../../actions/unreadComments';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { GetCelebrateFeed_community_celebrationItems_nodes } from '../CelebrateFeed/__generated__/GetCelebrateFeed';

import styles from './styles';

export interface GroupUnreadFeedProps {
  organization: Organization;
  count: number;
  analyticsPermissionType: TrackStateContext[typeof ANALYTICS_PERMISSION_TYPE];
}

const GroupUnreadFeed = ({
  organization,
  count,
  analyticsPermissionType,
}: GroupUnreadFeedProps) => {
  useAnalytics({
    screenName: ['celebrate', 'new comment items'],
    screenContext: { [ANALYTICS_PERMISSION_TYPE]: analyticsPermissionType },
  });
  const dispatch = useDispatch();
  const { t } = useTranslation('groupUnread');

  const back = () => dispatch(navigateBack());

  const handleRefetch = () => dispatch(refreshCommunity(organization.id));

  const markAllAsRead = async () => {
    await dispatch(markCommentsRead(organization.id));
    back();
  };

  const handleClearNotification = (
    event: GetCelebrateFeed_community_celebrationItems_nodes,
  ) => dispatch(markCommentRead(event.id));

  return (
    <View style={styles.pageContainer}>
      <StatusBar {...theme.statusBar.darkContent} />
      <Header
        left={<BackButton iconStyle={styles.backIcon} />}
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
          organization={organization}
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
        params: { organization },
      },
    },
  }: /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  any,
) => {
  const selectorOrg: Organization =
    organizationSelector({ organizations }, { orgId: organization.id }) ||
    organization;

  return {
    organization: selectorOrg,
    count: (selectorOrg.unread_comments_count || 0) as number,
    analyticsPermisisonType: getAnalyticsPermissionType(
      orgPermissionSelector(
        {},
        { person: auth.person, organization: selectorOrg },
      ),
    ),
  };
};

export default connect(mapStateToProps)(GroupUnreadFeed);
export const GROUP_UNREAD_FEED_SCREEN = 'nav/GROUP_UNREAD_FEED_SCREEN';
