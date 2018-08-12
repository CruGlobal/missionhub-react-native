import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import PropTypes from 'prop-types';

import Header from '../../containers/Header';
import BackButton from '../../containers/BackButton';
import FilterItem from '../FilterItem';

import styles from './styles';

export default class FilterList extends Component {
  handleDrillDown = item => {
    this.props.onDrillDown(item);
  };

  handleToggle = item => {
    this.props.onToggle(item);
  };

  render() {
    const { title, options, toggleOptions } = this.props;
    return (
      <View style={styles.pageContainer}>
        <Header left={<BackButton />} title={title} />
        <ScrollView style={{ flex: 1 }}>
          {options &&
            options.map(o => (
              <FilterItem
                key={o.id}
                item={o}
                onSelect={this.handleDrillDown}
                type="drilldown"
              />
            ))}
          {toggleOptions &&
            toggleOptions.map(o => (
              <FilterItem
                key={o.id}
                item={o}
                onSelect={this.handleToggle}
                type="switch"
                isSelected={o.selected}
              />
            ))}
        </ScrollView>
      </View>
    );
  }
}

FilterList.propTypes = {
  onDrillDown: PropTypes.func,
  onToggle: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      text: PropTypes.string,
      drilldown: PropTypes.array,
    }),
  ),
  toggleOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      selected: PropTypes.bool,
    }),
  ),
};
