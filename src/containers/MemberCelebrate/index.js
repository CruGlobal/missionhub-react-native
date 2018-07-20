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

@translate('celebrateFeeds')
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

  renderList() {
    const { celebrateItems } = this.props;

    return (
      <CelebrateFeed
        items={celebrateItems}
        loadMoreItemsCallback={this.loadItems}
        refreshCallback={this.refreshItems}
      />
    );
  }

  renderEmptyView() {
    const { person } = this.props;

    return <EmptyCelebrateFeed person={person} />;
  }

  render() {
    const { celebrateItems } = this.props;

    return celebrateItems.length === 0
      ? this.renderEmptyView()
      : this.renderList();
  }
}

const mapStateToProps = ({ organizations }, { organization, person }) => {
  const selectorOrg = organizationSelector(
    { organizations },
    { orgId: organization.id },
  );

  const filteredCelebrationItems = (selectorOrg.celebrateItems || []).filter(
    item => item.subject_person.id === person.id,
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
