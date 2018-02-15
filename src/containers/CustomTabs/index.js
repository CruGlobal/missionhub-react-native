import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Text, Icon } from '../../components/common';
import styles from './styles';
import { trackState } from '../../actions/analytics';

const ACTIVE_COLOR = 'rgba(255,255,255,1)';
const INACTIVE_COLOR = 'rgba(255,255,255,0.4)';

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
            <TouchableOpacity key={tab.iconName} onPress={() => this.goToTab(i, tab)} style={styles.tab}>
              <Icon
                name={tab.iconName}
                type="MissionHub"
                size={32}
                style={{ color: activeTab === i ? ACTIVE_COLOR : INACTIVE_COLOR }}
              />
              <Text style={[ styles.tabText, { color: activeTab === i ? ACTIVE_COLOR : INACTIVE_COLOR } ]}>
                {tab.tabLabel}
              </Text>
            </TouchableOpacity>
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
