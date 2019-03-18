import React, { Component } from 'react';
import { SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import moment from 'moment';

import CelebrateFeed from '../../components/CelebrateFeed';
import {
  getGroupCelebrateFeed,
  reloadGroupCelebrateFeed,
} from '../../actions/celebration';
import { refreshCommunity } from '../../actions/organizations';
import { organizationSelector } from '../../selectors/organizations';
import { celebrationSelector } from '../../selectors/celebration';
import { momentUtc, refresh } from '../../utils/common';
import { GLOBAL_COMMUNITY_ID } from '../../constants';
import { getReportedComments } from '../../actions/celebrateComments';

@translate('groupsCelebrate')
export class GroupCelebrate extends Component {
  state = { refreshing: false };

  componentDidMount() {
    if (this.shouldLoadFeed()) {
      this.loadItems();
    }
  }

  shouldLoadFeed = () => {
    const { pagination, celebrateItems } = this.props;

    return (
      !celebrateItems ||
      celebrateItems.length === 0 ||
      pagination.page === 0 ||
      moment().diff(momentUtc(celebrateItems[0].date), 'days', true) > 1
    );
  };

  loadItems = () => {
    const { dispatch, organization } = this.props;
    dispatch(getGroupCelebrateFeed(organization.id));
  };

  reloadItems = () => {
    const { dispatch, organization } = this.props;
    dispatch(refreshCommunity(organization.id));
    dispatch(getReportedComments(organization.id));
    return dispatch(reloadGroupCelebrateFeed(organization.id));
  };

  refreshItems = () => {
    refresh(this, this.reloadItems);
  };

  render() {
    const { refreshing } = this.state;
    const { celebrateItems, organization } = this.props;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <CelebrateFeed
          organization={organization}
          items={celebrateItems}
          loadMoreItemsCallback={this.loadItems}
          refreshCallback={this.refreshItems}
          refreshing={refreshing}
          itemNamePressable={organization.id !== GLOBAL_COMMUNITY_ID}
        />
      </SafeAreaView>
    );
  }
}

export const mapStateToProps = ({ organizations }, { organization = {} }) => {
  const selectorOrg =
    organizationSelector({ organizations }, { orgId: organization.id }) ||
    organization;

  const celebrateItems = celebrationSelector({
    celebrateItems: selectorOrg.celebrateItems || [],
  });

  return {
    celebrateItems,
    pagination: selectorOrg && selectorOrg.celebratePagination,
  };
};

export default connect(mapStateToProps)(GroupCelebrate);
