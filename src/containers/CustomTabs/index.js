import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Flex from '../../components/Flex';
import { Text, Icon, Touchable } from '../../components/common';
import styles from './styles';
import { trackState } from '../../actions/analytics';
import theme from '../../theme';

class CustomTabs extends Component {
  goToTab(i, tab) {
    this.props.goToPage(i);

    this.props.onChangeTab(i, tab.page);

    if (i !== this.props.activeTab) {
      this.props.dispatch(trackState(tab.tracking));
    }
  }

  render() {
    const { activeTab, tabArray, style, isHidden } = this.props;
    return (
      <View style={[ styles.tabs, style, isHidden ? styles.tabsHidden : undefined ]}>
        {tabArray.map((tab, i) => {
          return (
            <Touchable isAndroidOpacity={true} key={tab.iconName} onPress={() => this.goToTab(i, tab)} style={styles.tab}>
              <Flex value={1} align="center" justify="center" >
                <Flex value={4} align="center" justify="center">
                  <Icon
                    name={tab.iconName}
                    type="MissionHub"
                    size={tab.iconName === 'actionsIcon'? 26 : 32}
                    style={{ color: activeTab === i ? theme.contactHeaderIconActiveColor : theme.contactHeaderIconInactiveColor }}
                  />
                </Flex>
                <Flex value={1} align="center" justify="center">
                  <Text style={[ styles.tabText, { color: activeTab === i ? theme.contactHeaderIconActiveColor : theme.contactHeaderIconInactiveColor } ]}>
                    {tab.tabLabel}
                  </Text>
                </Flex>
              </Flex>
            </Touchable>
          );
        })}
      </View>
    );
  }
}

CustomTabs.propTypes = {
  tabArray: PropTypes.array.isRequired,
  activeTab: PropTypes.number,
  goToPage: PropTypes.func,
  onChangeTab: PropTypes.func,
  isHidden: PropTypes.bool,
};
export default connect()(CustomTabs);
