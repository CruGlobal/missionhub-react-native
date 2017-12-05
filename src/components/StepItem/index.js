import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Flex, Text } from '../common';
import styles from './styles';

export default class StepItem extends Component {
  render() {
    const { step, type } = this.props;
    return (
      <Flex
        justify="center"
        style={[
          styles.row,
          type && styles[type] ? styles[type] : null,
        ]}
      >
        <Text style={styles.person}>
          {step.id}
        </Text>
        <Text style={styles.description}>
          {step.body}
        </Text>
      </Flex>
    );
  }

}

StepItem.propTypes = {
  step: PropTypes.shape({
    id: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
  }).isRequired,
  type: PropTypes.oneOf(['draggable', 'swipeable', 'dragging', 'offscreen']),
};
