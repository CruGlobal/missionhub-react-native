import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux-legacy';
import moment from 'moment';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import CelebrateFeed from '../CelebrateFeed';
import {
  getGroupCelebrateFeed,
  reloadGroupCelebrateFeed,
} from '../../actions/celebration';
import { refreshCommunity } from '../../actions/organizations';
import { organizationSelector } from '../../selectors/organizations';
import {
  celebrationSelector,
  CelebrateItem,
} from '../../selectors/celebration';
import {
  momentUtc,
  refresh,
  orgIsGlobal,
  shouldQueryReportedComments,
} from '../../utils/common';
import { getReportedComments } from '../../actions/reportComments';
import { orgPermissionSelector } from '../../selectors/people';
import { AuthState } from '../../reducers/auth';
import { OrganizationsState } from '../../reducers/organizations';
import { Organization } from '../../reducers/organizations';
import Analytics from '../Analytics';

export interface GroupCelebrateProps {
  dispatch: ThunkDispatch<{ organizations: OrganizationsState }, {}, AnyAction>;
  organization: Organization;
  shouldQueryReport: boolean;
  celebrateItems: { id: number; date: string; data: CelebrateItem[] }[];
  pagination: any;
}

const GroupCelebrate = ({
  dispatch,
  organization,
  shouldQueryReport,
  celebrateItems,
  pagination,
}: GroupCelebrateProps) => {
  const [refreshing, setRefreshing] = useState(false);

  const shouldLoadFeed = () =>
    !celebrateItems ||
    celebrateItems.length === 0 ||
    pagination.page === 0 ||
    moment().diff(momentUtc(celebrateItems[0].date), 'days', true) > 1;

  const loadItems = () => dispatch(getGroupCelebrateFeed(organization.id));

  useEffect(() => {
    shouldLoadFeed() && loadItems();
  }, []);

  const reloadItems = () => {
    dispatch(refreshCommunity(organization.id));
    shouldQueryReport && dispatch(getReportedComments(organization.id));
    return dispatch(reloadGroupCelebrateFeed(organization.id));
  };

  const refreshItems = () => refresh(_, reloadItems);

  return (
    <>
      <Analytics screenName={['community', 'celebrate']} />
      <CelebrateFeed
        // @ts-ignore
        organization={organization}
        items={celebrateItems}
        loadMoreItemsCallback={loadItems}
        refreshCallback={refreshItems}
        refreshing={refreshing}
        itemNamePressable={!orgIsGlobal(organization)}
      />
    </>
  );
};

const mapStateToProps = (
  {
    auth,
    organizations,
  }: { auth: AuthState; organizations: OrganizationsState },
  { orgId }: { orgId: string },
) => {
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
