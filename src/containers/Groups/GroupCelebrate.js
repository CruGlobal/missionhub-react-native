import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import moment from 'moment';

import CelebrateFeed from '../../components/CelebrateFeed';
import EmptyCelebrateFeed from '../../components/EmptyCelebrateFeed';
import {
  getGroupCelebrateFeed,
  reloadGroupCelebrateFeed,
} from '../../actions/celebration';
import { organizationSelector } from '../../selectors/organizations';
import { celebrationSelector } from '../../selectors/celebration';
import { momentUtc, refresh } from '../../utils/common';

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
    return dispatch(reloadGroupCelebrateFeed(organization.id));
  };

  refreshItems = () => {
    refresh(this, this.reloadItems);
  };

  render() {
    const { refreshing } = this.state;
    const { celebrateItems, organization } = this.props;

    return celebrateItems.length !== 0 ? (
      <CelebrateFeed
        organization={organization}
        items={celebrateItems}
        loadMoreItemsCallback={this.loadItems}
        refreshCallback={this.refreshItems}
        refreshing={refreshing}
      />
    ) : (
      <EmptyCelebrateFeed
        refreshCallback={this.refreshItems}
        refreshing={refreshing}
      />
    );
  }
}

export const mapStateToProps = ({ organizations }, { organization }) => {
  const selectorOrg = organizationSelector(
    { organizations },
    { orgId: organization.id },
  );

  const celebrateItems = celebrationSelector({
    celebrateItems: (selectorOrg || {}).celebrateItems || [],
  });

  return {
    celebrateItems,
    pagination: selectorOrg && selectorOrg.celebratePagination,
  };
};

export default connect(mapStateToProps)(GroupCelebrate);
