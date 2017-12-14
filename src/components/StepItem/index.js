import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Flex, Text } from '../common';
import styles from './styles';

export default class StepItem extends Component {
  setNativeProps(nProps) { this._view.setNativeProps(nProps); }
  render() {
    const { step, type, isMe } = this.props;
    let ownerName = isMe ? 'Me' : step.receiver.full_name || '';
    ownerName = ownerName.toUpperCase();
    return (
      <Flex
        ref={(c) => this._view = c}
        justify="center"
        style={[
          styles.row,
          type && styles[type] ? styles[type] : null,
        ]}
      >
        {
          type === 'listSwipeable' ? null : (
            <Text style={styles.person}>
              {ownerName}
            </Text>
          )
        }
        <Text style={styles.description}>
          {step.title}
        </Text>
      </Flex>
    );
  }

}

StepItem.propTypes = {
  step: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    accepted_at: PropTypes.date,
    completed_at: PropTypes.date,
    created_at: PropTypes.date,
    updated_at: PropTypes.date,
    notified_at: PropTypes.date,
    note: PropTypes.string,
    owner: PropTypes.object.isRequired,
    receiver: PropTypes.object.isRequired,
  }).isRequired,
  isMe: PropTypes.bool,
  type: PropTypes.oneOf(['draggable', 'swipeable', 'listSwipeable', 'dragging', 'offscreen']),
};
