import React, { Component } from 'react';
import { connect } from 'react-redux';

import { MainTabBar, MainTabBarGroups } from '../AppRoutes';



class MainTabs extends Component {
  render() {
    return (this.props.groups ? <MainTabBarGroups /> : <MainTabBar />);
  }
}

const mapStateToProps = ({ auth }) => {
  return { groups: auth.groupsFeature };
};

export default connect(mapStateToProps)(MainTabs);
export const MAIN_TABS = 'nav/MAIN_TABS';