import React, { Component } from 'react';
import { connect } from 'react-redux';

import { MainTabBarStartSteps, MainTabBarStartGroups } from '../AppRoutes';

class MainTabs extends Component {
  render() {
    return this.props.startTab === 'groups' ? (
      <MainTabBarStartGroups />
    ) : (
      <MainTabBarStartSteps />
    );
  }
}

const mapStateToProps = ({ auth }, { navigation }) => ({
  startTab: (navigation.state.params || {}).startTab,
});

export default connect(mapStateToProps)(MainTabs);
export const MAIN_TABS = 'nav/MAIN_TABS';
