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
import { momentUtc, refresh, isOwner } from '../../utils/common';
import { GLOBAL_COMMUNITY_ID } from '../../constants';
import Flex from '../../components/Flex';
import { Touchable, Icon, Text, Card } from '../../components/common';
import { navigatePush } from '../../actions/navigation';
import { orgPermissionSelector } from '../../selectors/people';

import { GROUPS_REPORT_SCREEN } from './GroupReport';
import styles from './styles';

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
    return dispatch(reloadGroupCelebrateFeed(organization.id));
  };

  refreshItems = () => {
    refresh(this, this.reloadItems);
  };

  report = () => this.props.dispatch(navigatePush(GROUPS_REPORT_SCREEN));

  renderReportData() {
    const { t, reportItems, isOwner } = this.props;
    if (!isOwner) {
      return null;
    }
    const count = reportItems.length;
    if (count === 0) {
      return null;
    }
    return (
      <Flex style={styles.reportItemWrap}>
        <Card onPress={this.report} style={styles.reportItem}>
          <Icon
            name="surveyIcon"
            type="MissionHub"
            size={20}
            style={styles.reportItemIcon}
          />
          <Text style={styles.reportItemText}>
            {t('reports', { count: 0 })}
          </Text>
        </Card>
      </Flex>
    );
  }

  render() {
    const { refreshing } = this.state;
    const { celebrateItems, organization } = this.props;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        {this.renderReportData()}
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

export const mapStateToProps = (
  { auth, organizations, celebrateComments },
  { organization = {} },
) => {
  const selectorOrg =
    organizationSelector({ organizations }, { orgId: organization.id }) ||
    organization;

  const celebrateItems = celebrationSelector({
    celebrateItems: selectorOrg.celebrateItems || [],
  });
  const myOrgPerm = orgPermissionSelector(null, {
    person: auth.person,
    organization: { id: selectorOrg.id },
  });

  return {
    isOwner: isOwner(myOrgPerm),
    reportItems: celebrateComments.reportItems,
    celebrateItems,
    pagination: selectorOrg && selectorOrg.celebratePagination,
  };
};

export default connect(mapStateToProps)(GroupCelebrate);
