import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Flex, Text, Icon, DateComponent } from '../common';
import styles from './styles';

export default class JourneyItem extends Component {
  setNativeProps(nProps) { this._view.setNativeProps(nProps); }
  render() {
    const { item, type } = this.props;
    return (
      <Flex
        ref={(c) => this._view = c}
        direction="row"
        align="center"
        style={[
          styles.row,
          type && styles[type] ? styles[type] : null,
        ]}
      >
        {
          type === 'step' ? (
            <Icon name="stepsIcon" type="MissionHub" size={32} style={styles.icon} />
          ) : null
        }
        <Flex value={1} direction="column" style={styles.textWrap}>
          <DateComponent date={item.completed_at} style={styles.date} format="LL" />
          <Text style={styles.text}>
            {item.text}
          </Text>
        </Flex>
      </Flex>
    );
  }

}

JourneyItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    completed_at: PropTypes.date,
  }).isRequired,
  type: PropTypes.oneOf(['step']),
};
