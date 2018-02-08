import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Text, Icon } from '../../components/common';
import styles from './styles';
import { trackState } from '../../actions/analytics';

class CustomTabs extends Component {
  constructor(props) {
    super(props);
    this.icons = [];
  }

  goToTab(i, tab) {
    this.props.goToPage(i);

    if (i !== this.props.activeTab) {
      this.props.dispatch(trackState(tab.screenName));
    }
  }

  render() {
    return (
      <View style={[ styles.tabs, this.props.style ]}>
        {this.props.tabArray.map((tab, i) => {
          return (
            <TouchableOpacity key={tab.iconName} onPress={() => this.goToTab(i, tab)} style={styles.tab}>
              <Icon
                name={tab.iconName}
                type="MissionHub"
                size={32}
                style={{ color: this.props.activeTab === i ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.4)' }}
                ref={(icon) => { this.icons[i] = icon; }}
              />
              <Text style={[ styles.tabText, { color: this.props.activeTab === i ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.4)' } ]}>{tab.tabLabel}</Text>
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
};
export default connect()(CustomTabs);
