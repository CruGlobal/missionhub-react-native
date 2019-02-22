import React, { Component } from 'react';
import { connect } from 'react-redux';

import { MainTabBarStartSteps, MainTabBarStartGroups } from '../AppRoutes';
import { SafeView } from '../components/common';
import theme from '../theme';

const isiPhoneXrOrXSMax = theme.fullHeight === 896 || theme.fullWidth === 896;

class MainTabs extends Component {
  render() {
    const content =
      this.props.startTab === 'groups' ? (
        <MainTabBarStartGroups />
      ) : (
        <MainTabBarStartSteps />
      );
    // Until React Navigation is updated, we need to do this for iphone xr/xsmax
    if (isiPhoneXrOrXSMax) {
      return <SafeView bg="white">{content}</SafeView>;
    }
    return content;
  }
}

const mapStateToProps = (_, { navigation }) => ({
  startTab: (navigation.state.params || {}).startTab,
});

export default connect(mapStateToProps)(MainTabs);
export const MAIN_TABS = 'nav/MAIN_TABS';
