import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Text, Card } from '../common';
import { navigatePush } from '../../actions/navigation';
import { SUGGESTED_STEP_DETAIL_SCREEN } from '../../containers/SuggestedStepDetailScreen';

import styles from './styles';

class StepSuggestionItem extends Component {
  handlePress = () => {
    const { dispatch, step, receiverId, orgId, next } = this.props;
    dispatch(
      navigatePush(SUGGESTED_STEP_DETAIL_SCREEN, {
        step,
        receiverId,
        orgId,
        next,
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
