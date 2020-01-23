import React, { Component } from 'react';
import { connect } from 'react-redux-legacy';
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
import Analytics from '../Analytics';

// @ts-ignore
@withTranslation('celebrateFeeds')
class MemberCelebrate extends Component {
  componentDidMount() {
    if (this.shouldLoadFeed()) {
      this.loadItems();
    }
  }

  shouldLoadFeed = () => {
    // @ts-ignore
    const { pagination, celebrateItems } = this.props;

    return (
      !celebrateItems ||
      celebrateItems.length === 0 ||
      pagination.page === 0 ||
      // @ts-ignore
      moment().diff(momentUtc(celebrateItems[0].date), 'days', true > 1)
    );
  };

  loadItems = () => {
    // @ts-ignore
    const { dispatch, person, organization } = this.props;
    dispatch(getGroupCelebrateFeed(organization.id, person.id));
  };

  refreshItems = () => {
    // @ts-ignore
    const { dispatch, person, organization } = this.props;
    // @ts-ignore
    dispatch(reloadGroupCelebrateFeed(organization.id, person.id));
  };

  render() {
    // @ts-ignore
    const { organization, celebrateItems } = this.props;

    return (
      <>
        <Analytics screenName={['person', 'celebrate']} />
        <CelebrateFeed
          // @ts-ignore
          organization={organization}
          items={celebrateItems}
          loadMoreItemsCallback={this.loadItems}
          refreshCallback={this.refreshItems}
          itemNamePressable={false}
          isMember={true}
        />
      </>
    );
  }
}

// @ts-ignore
const mapStateToProps = ({ organizations }, { organization, person }) => {
  const selectorOrg = organizationSelector(
    { organizations },
    { orgId: organization.id },
  );

  const filteredCelebrationItems = (selectorOrg.celebrateItems || []).filter(
    // @ts-ignore
    item => item.subject_person && item.subject_person.id === person.id,
  );

  const celebrateItems = celebrationSelector({
    celebrateItems: filteredCelebrationItems,
  });

  return {
    organization: selectorOrg,
    celebrateItems,
    pagination: selectorOrg.celebratePagination,
  };
};

export default connect(mapStateToProps)(MemberCelebrate);
