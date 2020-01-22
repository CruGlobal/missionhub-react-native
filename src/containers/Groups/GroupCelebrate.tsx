import React, { Component } from 'react';
import { connect } from 'react-redux-legacy';
import { withTranslation } from 'react-i18next';
import moment from 'moment';

import CelebrateFeed from '../CelebrateFeed';
import {
  getGroupCelebrateFeed,
  reloadGroupCelebrateFeed,
} from '../../actions/celebration';
import { refreshCommunity } from '../../actions/organizations';
import { organizationSelector } from '../../selectors/organizations';
import { celebrationSelector } from '../../selectors/celebration';
import {
  momentUtc,
  refresh,
  orgIsGlobal,
  shouldQueryReportedComments,
} from '../../utils/common';
import { getReportedComments } from '../../actions/reportComments';
import { orgPermissionSelector } from '../../selectors/people';
import Analytics from '../Analytics';

// @ts-ignore
@withTranslation('groupsCelebrate')
class GroupCelebrate extends Component {
  state = { refreshing: false };

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
      moment().diff(momentUtc(celebrateItems[0].date), 'days', true) > 1
    );
  };

  loadItems = () => {
    // @ts-ignore
    const { dispatch, organization } = this.props;
    dispatch(getGroupCelebrateFeed(organization.id));
  };

  reloadItems = () => {
    // @ts-ignore
    const { dispatch, organization, shouldQueryReport } = this.props;
    dispatch(refreshCommunity(organization.id));
    shouldQueryReport && dispatch(getReportedComments(organization.id));
    return dispatch(reloadGroupCelebrateFeed(organization.id));
  };

  refreshItems = () => {
    refresh(this, this.reloadItems);
  };

  render() {
    const { refreshing } = this.state;
    // @ts-ignore
    const { celebrateItems, organization } = this.props;

    return (
      <>
        <Analytics screenName={['community', 'celebrate']} />
        <CelebrateFeed
          // @ts-ignore
          organization={organization}
          items={celebrateItems}
          loadMoreItemsCallback={this.loadItems}
          refreshCallback={this.refreshItems}
          refreshing={refreshing}
          itemNamePressable={!orgIsGlobal(organization)}
        />
      </>
    );
  }
}

// @ts-ignore
const mapStateToProps = ({ auth, organizations }, { orgId }) => {
  const organization = organizationSelector({ organizations }, { orgId });
  const myOrgPermission = orgPermissionSelector(
    {},
    { person: auth.person, organization },
  );

  return {
    organization,
    shouldQueryReport: shouldQueryReportedComments(
      organization,
      myOrgPermission,
    ),
    celebrateItems: celebrationSelector({
      celebrateItems: organization.celebrateItems || [],
    }),
    pagination: organization.celebratePagination || {},
  };
};

export default connect(mapStateToProps)(GroupCelebrate);
