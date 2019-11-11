import React, { Component } from 'react';
import { StatusBar, View } from 'react-native';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { refresh } from '../../utils/common';
import Header from '../../components/Header';
import { IconButton, Button } from '../../components/common';
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

import styles from './styles';

@withTranslation('groupUnread')
class GroupUnreadFeed extends Component {
  state = { refreshing: false, items: [] };

  componentDidMount() {
    this.loadItems();
  }

  loadItems = async () => {
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
    const { dispatch, organization } = this.props;
    await dispatch(markCommentsRead(organization.id));
    this.back();
  };

  clearNotification = async event => {
    const { dispatch } = this.props;
    await dispatch(markCommentRead(event.id));
    this.loadItems();
  };

  back = () => this.props.dispatch(navigateBack());

  render() {
    const { t, organization, count } = this.props;
    const { refreshing, items } = this.state;

    return (
      <View style={styles.pageContainer}>
        <StatusBar {...theme.statusBar.darkContent} />
        <Header
          left={
            <IconButton
              name="backIcon"
              type="MissionHub"
              style={styles.backIcon}
              onPress={this.back}
            />
          }
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
  { organizations },
  {
    navigation: {
      state: {
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
