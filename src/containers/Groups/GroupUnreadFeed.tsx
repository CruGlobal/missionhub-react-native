import React, { Component } from 'react';
import { StatusBar, View } from 'react-native';
import { connect } from 'react-redux-legacy';
import { withTranslation } from 'react-i18next';

import { refresh } from '../../utils/common';
import Header from '../../components/Header';
import { Button } from '../../components/common';
import BackButton from '../BackButton';
import { navigateBack } from '../../actions/navigation';
import { organizationSelector } from '../../selectors/organizations';
import { getGroupCelebrateFeedUnread } from '../../actions/celebration';
import CelebrateFeed from '../CelebrateFeed';
import theme from '../../theme';
import { celebrationSelector } from '../../selectors/celebration';
import { refreshCommunity } from '../../actions/organizations';
import {
  markCommentsRead,
  markCommentRead,
} from '../../actions/unreadComments';
import Analytics from '../Analytics';

import styles from './styles';

// @ts-ignore
@withTranslation('groupUnread')
class GroupUnreadFeed extends Component {
  state = { refreshing: false, items: [] };

  componentDidMount() {
    this.loadItems();
  }

  loadItems = async () => {
    // @ts-ignore
    const { dispatch, organization } = this.props;
    dispatch(refreshCommunity(organization.id));
    const { response } = await dispatch(
      getGroupCelebrateFeedUnread(organization.id),
    );
    const items = celebrationSelector({
      celebrateItems: response || [],
    });
    this.setState({ items });
    return items;
  };

  refreshItems = () => {
    refresh(this, this.loadItems);
  };

  markRead = async () => {
    // @ts-ignore
    const { dispatch, organization } = this.props;
    await dispatch(markCommentsRead(organization.id));
    this.back();
  };

  // @ts-ignore
  clearNotification = async event => {
    // @ts-ignore
    const { dispatch } = this.props;
    await dispatch(markCommentRead(event.id));
    this.loadItems();
  };

  // @ts-ignore
  back = () => this.props.dispatch(navigateBack());

  render() {
    // @ts-ignore
    const { t, organization, count } = this.props;
    const { refreshing, items } = this.state;

    return (
      <View style={styles.pageContainer}>
        <Analytics screenName={['celebrate', 'new comment items']} />
        <StatusBar {...theme.statusBar.darkContent} />
        <Header
          left={<BackButton iconStyle={styles.backIcon} />}
          right={
            <Button
              type="transparent"
              text={t('clearAll').toUpperCase()}
              style={styles.clearAllButton}
              buttonTextStyle={styles.clearAllButtonText}
              onPress={this.markRead}
            />
          }
          shadow={true}
          title={t('title', { count })}
          titleStyle={styles.unreadTitle}
        />
        <View style={styles.cardList}>
          <CelebrateFeed
            // @ts-ignore
            organization={organization}
            items={items}
            refreshCallback={this.refreshItems}
            refreshing={refreshing}
            itemNamePressable={true}
            noHeader={true}
            onClearNotification={this.clearNotification}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (
  // @ts-ignore
  { organizations },
  {
    navigation: {
      state: {
        // @ts-ignore
        params: { organization },
      },
    },
  },
) => {
  const selectorOrg =
    organizationSelector({ organizations }, { orgId: organization.id }) ||
    organization;

  return {
    organization: selectorOrg,
    count: selectorOrg.unread_comments_count || 0,
  };
};

export default connect(mapStateToProps)(GroupUnreadFeed);
export const GROUP_UNREAD_FEED_SCREEN = 'nav/GROUP_UNREAD_FEED_SCREEN';
