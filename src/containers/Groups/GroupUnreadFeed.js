import React, { Component } from 'react';
import { StatusBar, View, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { refresh } from '../../utils/common';
import Header from '../../components/Header';
import { IconButton } from '../../components/common';
import { navigateBack } from '../../actions/navigation';
import { organizationSelector } from '../../selectors/organizations';
import { getGroupCelebrateFeedUnread } from '../../actions/celebration';
import CelebrateFeed from '../CelebrateFeed';
import theme from '../../theme';
import { celebrationSelector } from '../../selectors/celebration';
import { refreshCommunity } from '../../actions/organizations';
import { markCommentsRead } from '../../actions/unreadComments';

import styles from './styles';

@translate('groupUnread')
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
    dispatch(markCommentsRead(organization.id));
    return items;
  };

  refreshItems = () => {
    refresh(this, this.loadItems);
  };

  navigateBack = () => this.props.dispatch(navigateBack());

  render() {
    const { t, organization, count } = this.props;
    const { refreshing, items } = this.state;

    return (
      <View style={styles.pageContainer}>
        <StatusBar {...theme.statusBar.darkContent} />
        <Header
          right={
            <IconButton
              name="deleteIcon"
              type="MissionHub"
              style={{ color: 'black' }}
              onPress={this.navigateBack}
            />
          }
          style={styles.unreadHeader}
          title={t('title', { count })}
          titleStyle={styles.unreadTitle}
          shadow={true}
        />
        <SafeAreaView style={styles.cardList}>
          <CelebrateFeed
            organization={organization}
            items={items}
            refreshCallback={this.refreshItems}
            refreshing={refreshing}
            itemNamePressable={true}
            noHeader={true}
          />
        </SafeAreaView>
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
