import React, { Component } from 'react';
import { connect } from 'react-redux';

import { MainTabBarStartSteps, MainTabBarStartGroups } from '../AppRoutes';
import { SafeView } from '../components/common';

class MainTabs extends Component {
  render() {
    return this.props.startTab === 'groups' ? (
      <SafeView bg="white">
        <MainTabBarStartGroups />
      </SafeView>
    ) : (
      <SafeView bg="white">
        <MainTabBarStartSteps />
      </SafeView>
    );
  }
}

const mapStateToProps = (_, { navigation }) => ({
  startTab: (navigation.state.params || {}).startTab,
});

export default connect(mapStateToProps)(MainTabs);
export const MAIN_TABS = 'nav/MAIN_TABS';
