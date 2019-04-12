import React, { Component } from 'react';
import { connect } from 'react-redux';

import { loadHome } from '../actions/auth/userData';
import { MainTabBarStartSteps, MainTabBarStartGroups } from '../AppRoutes';

class MainTabs extends Component {
  componentDidMount() {
    this.props.dispatch(loadHome());
  }

  render() {
    return this.props.startTab === 'groups' ? (
      <MainTabBarStartGroups />
    ) : (
      <MainTabBarStartSteps />
    );
  }
}

const mapStateToProps = (_, { navigation }) => ({
  startTab: (navigation.state.params || {}).startTab,
});

export default connect(mapStateToProps)(MainTabs);
export const MAIN_TABS = 'nav/MAIN_TABS';
