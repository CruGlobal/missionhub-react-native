import React from 'react';
import { StatusBar, View } from 'react-native';
import { connect } from 'react-redux-legacy';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import Header from '../../components/Header';
import { Button } from '../../components/common';
import BackButton from '../BackButton';
import { navigateBack } from '../../actions/navigation';
import { organizationSelector } from '../../selectors/organizations';
import CelebrateFeed from '../CelebrateFeed';
import theme from '../../theme';
import { refreshCommunity } from '../../actions/organizations';
import { OrganizationsState, Organization } from '../../reducers/organizations';
import {
  markCommentsRead,
  markCommentRead,
} from '../../actions/unreadComments';
import { GetCelebrateFeed_community_celebrationItems_nodes } from '../CelebrateFeed/__generated__/GetCelebrateFeed';
import Analytics from '../Analytics';

import styles from './styles';

export interface GroupUnreadFeedProps {
  dispatch: ThunkDispatch<{ organizations: OrganizationsState }, {}, AnyAction>;
  organization: Organization;
  count: number;
}

const GroupUnreadFeed = ({
  dispatch,
  organization,
  count,
}: GroupUnreadFeedProps) => {
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
      <Analytics screenName={['celebrate', 'new comment items']} />
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
  { organizations }: { organizations: OrganizationsState },
  {
    navigation: {
      state: {
        params: { organization },
      },
    },
  }: /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  any,
) => {
  const selectorOrg =
    organizationSelector({ organizations }, { orgId: organization.id }) ||
    organization;

  return {
    organization: selectorOrg as Organization,
    count: (selectorOrg.unread_comments_count || 0) as number,
  };
};

export default connect(mapStateToProps)(GroupUnreadFeed);
export const GROUP_UNREAD_FEED_SCREEN = 'nav/GROUP_UNREAD_FEED_SCREEN';
