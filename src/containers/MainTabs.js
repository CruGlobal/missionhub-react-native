import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  MainTabBar,
  MainTabBarGroups,
  MainTabBarGroupsStartGroups,
} from '../AppRoutes';

class MainTabs extends Component {
  render() {
    const { groups, startTab } = this.props;
    if (groups) {
      if (startTab === 'groups') {
        return <MainTabBarGroupsStartGroups />;
      }
      return <MainTabBarGroups />;
    }
    return <MainTabBar />;
  }
}

const mapStateToProps = ({ auth }, { navigation }) => ({
  startTab: (navigation.state.params || {}).startTab,
  groups: true || auth.person.user.groups_feature,
});

export default connect(mapStateToProps)(MainTabs);
export const MAIN_TABS = 'nav/MAIN_TABS';
