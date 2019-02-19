import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Text, Card } from '../common';
import { navigatePush } from '../../actions/navigation';
import { STEP_DETAIL_SCREEN } from '../../containers/StepDetailScreen';

import styles from './styles';

class StepSuggestionItem extends Component {
  handlePress = () => {
    const { dispatch, step, receiverId, orgId } = this.props;
    dispatch(navigatePush(STEP_DETAIL_SCREEN, { step, receiverId, orgId }));
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
};

export default connect()(StepSuggestionItem);
