import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Flex from '../../components/Flex';
import { Text, Icon, Touchable } from '../../components/common';
import { trackState } from '../../actions/analytics';
import theme from '../../theme';
import { CONTACT_TAB_CHANGED } from '../../constants';

import styles from './styles';

class CustomTabs extends Component {
  goToTab(i, tab) {
    const { goToPage, onChangeTab, activeTab, dispatch } = this.props;

    goToPage(i);

    onChangeTab(i, tab.page);

    if (i !== activeTab) {
      dispatch({ type: CONTACT_TAB_CHANGED, newActiveTab: tab.tracking });
      dispatch(trackState(tab.tracking));
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
                <Flex value={1} align="center" justify="center">
                  <Icon
                    name={tab.iconName}
                    type="MissionHub"
                    size={tab.iconName === 'actionsIcon' ? 26 : 32}
                    style={{ color: activeTab === i ? theme.contactHeaderIconActiveColor : theme.contactHeaderIconInactiveColor }}
                  />
                </Flex>
                <Flex align="center" justify="center">
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
