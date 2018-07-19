import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import CelebrateFeed from '../../components/CelebrateFeed';
import EmptyCelebrateFeed from '../../components/EmptyCelebrateFeed';
import {
  getGroupCelebrateFeed,
  reloadGroupCelebrateFeed,
} from '../../actions/celebration';
import { organizationSelector } from '../../selectors/organizations';
import { celebrationSelector } from '../../selectors/celebration';

@translate('groupsCelebrate')
export class GroupCelebrate extends Component {
  componentDidMount() {
    this.loadItems();
  }

  loadItems = () => {
    const { dispatch, organization } = this.props;
    dispatch(getGroupCelebrateFeed(organization.id));
  };

  refreshItems = () => {
    const { dispatch, organization } = this.props;
    dispatch(reloadGroupCelebrateFeed(organization.id));
  };

  submit = data => {
    return data;
  };

  render() {
    const { celebrateItems } = this.props;

    return celebrateItems.length > 0 ? (
      <CelebrateFeed
        items={celebrateItems}
        loadMoreItemsCallback={() => this.loadItems()}
        refreshCallback={() => this.refreshItems()}
      />
    ) : (
      <EmptyCelebrateFeed />
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
    pagination: organizations.celebratePagination,
  };
};

export default connect(mapStateToProps)(GroupCelebrate);
