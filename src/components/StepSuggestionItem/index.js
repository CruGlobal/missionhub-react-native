import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Text, Card } from '../common';
import { navigatePush } from '../../actions/navigation';
import { SUGGESTED_STEP_DETAIL_SCREEN } from '../../containers/SuggestedStepDetailScreen';

import styles from './styles';

class StepSuggestionItem extends Component {
  handlePress = () => {
    const { dispatch, step, receiverId, orgId, onComplete } = this.props;
    dispatch(
      navigatePush(SUGGESTED_STEP_DETAIL_SCREEN, {
        step,
        receiverId,
        orgId,
        onComplete,
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
  onComplete: PropTypes.func.isRequired,
  orgId: PropTypes.string,
};

export default connect()(StepSuggestionItem);
