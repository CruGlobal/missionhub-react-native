import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Text, Flex, Card } from '../common';
import { navigatePush } from '../../actions/navigation';
import { STEP_DETAIL_SCREEN } from '../../containers/StepDetailScreen';

import styles from './styles';

export class StepSuggestionItem extends Component {
  handlePress = () => {
    const { dispatch, step } = this.props;
    dispatch(navigatePush(STEP_DETAIL_SCREEN, { step }));
  };

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
