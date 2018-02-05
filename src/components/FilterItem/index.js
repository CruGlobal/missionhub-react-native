import React, { Component } from 'react';
import { Switch } from 'react-native';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { Flex, Text, Touchable, Icon } from '../common';
import styles from './styles';
import theme from '../../theme';

@translate('searchFilterRefine')
export default class FilterItem extends Component {
  handleSelect = () => { this.props.onSelect(this.props.item); }
  renderRight() {
    const { item, type, isSelected, t } = this.props;

    if (type === 'drilldown') {
      return (
        <Flex direction="row" align="center">
          <Text style={styles.anyText} numberOfLines={1}>
            {item.preview || t('any')}
          </Text>
          <Icon name="rightArrowIcon" type="MissionHub" style={styles.anyIcon} />
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
    id: PropTypes.string,
    text: PropTypes.string,
    preview: PropTypes.string,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  type: PropTypes.oneOf([ 'drilldown', 'single', 'switch' ]).isRequired,
  isSelected: PropTypes.bool,
};
