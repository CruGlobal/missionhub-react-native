import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import moment from 'moment';

import CelebrateFeed from '../../components/CelebrateFeed';
import EmptyCelebrateFeed from '../../components/EmptyCelebrateFeed';
import {
  getCelebrateFeed,
  reloadCelebrateFeed,
} from '../../actions/celebration';
import { organizationSelector } from '../../selectors/organizations';
import {
  celebrationSelector,
  celebrationByDateSelector,
} from '../../selectors/celebration';
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
    dispatch(getCelebrateFeed(organization, person.id));
  };

  refreshItems = () => {
    const { dispatch, person, organization } = this.props;
    dispatch(reloadCelebrateFeed(organization, person.id));
  };

  renderList() {
    const { organization, celebrateItems } = this.props;

    return (
      <CelebrateFeed
        organization={organization}
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

const mapStateToProps = ({ organizations, celebration }, { orgId, person }) => {
  const organization = organizationSelector({ organizations }, { orgId });

  const celebrateFeed = celebrationSelector({ celebration }, { organization });

  const filteredCelebrationItems = (celebrateFeed.items || []).filter(
    item => item.subject_person && item.subject_person.id === person.id,
  );

  const celebrateItems = celebrationByDateSelector({
    celebrateItems: filteredCelebrationItems,
  });

  return {
    organization,
    celebrateItems,
    pagination: celebrateFeed.pagination || {},
  };
};

export default connect(mapStateToProps)(MemberCelebrate);
