import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Text, Flex, Card } from '../common';
import { navigatePush } from '../../actions/navigation';

import styles from './styles';

export class StepSuggestionItem extends Component {
  handlePress = step => {};

  render() {
    const {
      step: { body = '' },
    } = this.props;

    return (
      <Card onPress={this.handlePress} style={styles.card}>
        <Text style={styles.stepText}>{body}</Text>
      </Card>
    );
  }
}

StepSuggestionItem.propTypes = {
  step: PropTypes.shape({
    body: PropTypes.string.isRequired,
  }).isRequired,
};

export default connect()(StepSuggestionItem);
