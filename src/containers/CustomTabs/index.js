import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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
    const { activeTab, tabArray, style } = this.props;
    return (
      <View style={[ styles.tabs, style ]}>
        {tabArray.map((tab, i) => {
          return (
            <Touchable isAndroidOpacity={true} key={tab.iconName} onPress={() => this.goToTab(i, tab)} style={styles.tab}>
              <Icon
                name={tab.iconName}
                type="MissionHub"
                size={32}
                style={{ color: activeTab === i ? theme.contactHeaderIconActiveColor : theme.contactHeaderIconInactiveColor }}
              />
              <Text style={[ styles.tabText, { color: activeTab === i ? theme.contactHeaderIconActiveColor : theme.contactHeaderIconInactiveColor } ]}>
                {tab.tabLabel}
              </Text>
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
};
export default connect()(CustomTabs);
