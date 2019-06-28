import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Text, Card } from '../common';

import styles from './styles';

export default class StepSuggestionItem extends Component {
  handlePress = () => {
    const { step, onPress } = this.props;
    onPress(step);
  };

  render() {
    const {
      step: { body },
    } = this.props;

    return (
      <Card
        testID="stepSuggestionCard"
        onPress={this.handlePress}
        style={styles.card}
      >
        <Text style={styles.stepText}>{body}</Text>
      </Card>
    );
  }
}

StepSuggestionItem.propTypes = {
  step: PropTypes.shape({
    body: PropTypes.string.isRequired,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
};
