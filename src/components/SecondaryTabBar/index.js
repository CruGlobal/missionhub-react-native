import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { Flex, Text } from '../common';
// import styles from './styles';
import CustomTabs from '../CustomTabs';

export default class SecondaryTabBar extends Component {

  constructor(props) {
    super(props);

  }

  renderTabs = (tab) => {
    return (
      <Flex key={tab.tabIcon} style={{backgroundColor: 'white'}} value={1}>
        <Text >{tab.page}</Text>
        <Text >{tab.page}</Text>
        <Text >{tab.page}</Text>
        <Text >{tab.page}</Text>
      </Flex>
    );
  }

  render() {
    const { tabs } = this.props;

    return (
      <Flex value={1} >
        <ScrollableTabView
          tabBarPosition="top"
          initialPage={0}
          locked={true}
          renderTabBar={() => <CustomTabs tabArray={tabs} />}
        >
          {
            tabs.map(this.renderTabs)
          }
        </ScrollableTabView>
      </Flex>
    );
  }
}

SecondaryTabBar.propTypes = {
  tabs: PropTypes.array.isRequired,
};
