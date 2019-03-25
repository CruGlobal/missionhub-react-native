import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Text, Card } from '../common';

import styles from './styles';

class StepSuggestionItem extends Component {
  handlePress = () => {
    const { dispatch, step, receiverId, orgId, next } = this.props;
    dispatch(
      next({
        isAddingCustomStep: false,
        step,
        receiverId,
        orgId,
      }),
    );
  };

  render() {
    const {
      step: { body },
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
  receiverId: PropTypes.string.isRequired,
  orgId: PropTypes.string,
  next: PropTypes.func.isRequired,
};

export default connect()(StepSuggestionItem);
