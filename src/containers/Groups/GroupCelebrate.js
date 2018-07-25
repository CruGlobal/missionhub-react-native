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
import { momentUtc } from '../../utils/common';

@translate('groupsCelebrate')
export class GroupCelebrate extends Component {
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
      moment().diff(momentUtc(celebrateItems[0].date), 'days', true > 1)
    );
  };

  loadItems = () => {
    const { dispatch, organization } = this.props;
    dispatch(getGroupCelebrateFeed(organization.id));
  };

  refreshItems = () => {
    const { dispatch, organization } = this.props;
    dispatch(reloadGroupCelebrateFeed(organization.id));
  };

  render() {
    const { celebrateItems, organization } = this.props;

    return celebrateItems.length !== 0 ? (
      <CelebrateFeed
        organization={organization}
        items={celebrateItems}
        loadMoreItemsCallback={this.loadItems}
        refreshCallback={this.refreshItems}
      />
    ) : (
      <EmptyCelebrateFeed />
    );
  }
}

export const mapStateToProps = ({ auth, organizations }, { organization }) => {
  const selectorOrg = organizationSelector(
    { organizations },
    { orgId: organization.id },
  );

  const celebrateItems = celebrationSelector({
    celebrateItems: (selectorOrg || {}).celebrateItems || [],
  });

  return {
    myId: auth.person.user.id,
    celebrateItems,
    pagination: selectorOrg.celebratePagination,
  };
};

export default connect(mapStateToProps)(GroupCelebrate);
