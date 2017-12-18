import React, { Component } from 'react';
import { Switch } from 'react-native';
import PropTypes from 'prop-types';

import { Flex, Text, Touchable, Icon } from '../common';
import styles from './styles';
import theme from '../../theme';

export default class FilterItem extends Component {
  handleSelect = () => { this.props.onSelect(this.props.item); }
  renderRight() {
    const { item, type, isSelected } = this.props;

    if (type === 'drilldown') {
      return (
        <Flex direction="row" align="center">
          <Text style={styles.anyText} numberOfLines={1}>
            {item.preview || 'Any'}
          </Text>
          <Icon name="menuIcon" type="MissionHub" style={styles.anyIcon} />
        </Flex>
      );
    }
    if (type === 'switch') {
      return (
        <Switch
          onValueChange={this.handleSelect}
          value={this.props.isSelected}
          onTintColor={theme.primaryColor}
        />
      );
    }
    if (type === 'single' && isSelected) {
      return (
        <Icon name="checkIcon" type="MissionHub" style={styles.checkIcon} />
      );
    }
    return null;
  }
  render() {
    const { item, type } = this.props;
    const content = (
      <Flex
        direction="row"
        align="center"
        style={[
          styles.row,
          type === 'switch' ? styles.switchRow : null,
        ]}>
        <Text style={styles.name}>
          {item.text}
        </Text>
        {this.renderRight()}
      </Flex>
    );

    if (type === 'drilldown' || type === 'single') {
      return (
        <Touchable highlight={true} onPress={this.handleSelect}>
          {content}
        </Touchable>
      );
    }
    return content;
  }

}

FilterItem.propTypes = {
  item: PropTypes.shape({
    text: PropTypes.string,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['drilldown', 'single', 'switch']).isRequired,
  isSelected: PropTypes.bool,
};
