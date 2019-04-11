import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import moment from 'moment';

import CelebrateFeed from '../CelebrateFeed';
import {
  getGroupCelebrateFeed,
  reloadGroupCelebrateFeed,
} from '../../actions/celebration';
import { organizationSelector } from '../../selectors/organizations';
import { celebrationSelector } from '../../selectors/celebration';
import { momentUtc } from '../../utils/common';

@withTranslation('celebrateFeeds')
class MemberCelebrate extends Component {
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
    const { dispatch, person, organization } = this.props;
    dispatch(getGroupCelebrateFeed(organization.id, person.id));
  };

  refreshItems = () => {
    const { dispatch, person, organization } = this.props;
    dispatch(reloadGroupCelebrateFeed(organization.id, person.id));
  };

  render() {
    const { organization, celebrateItems } = this.props;

    return (
      <CelebrateFeed
        organization={organization}
        items={celebrateItems}
        loadMoreItemsCallback={this.loadItems}
        refreshCallback={this.refreshItems}
        itemNamePressable={false}
        isMember={true}
      />
    );
  }
}

const mapStateToProps = ({ organizations }, { organization, person }) => {
  const selectorOrg =
    organizationSelector({ organizations }, { orgId: organization.id }) || {};

  const filteredCelebrationItems = (selectorOrg.celebrateItems || []).filter(
    item => item.subject_person && item.subject_person.id === person.id,
  );

  const celebrateItems = celebrationSelector({
    celebrateItems: filteredCelebrationItems,
  });

  return {
    celebrateItems,
    pagination: selectorOrg.celebratePagination,
  };
};

export default connect(mapStateToProps)(MemberCelebrate);
