import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { View, Text, Card, IconButton } from '../common';
import { navigatePush } from '../../actions/navigation';
import { STEP_DETAIL_SCREEN } from '../../containers/StepDetailScreen';

import styles from './styles';
import Icon from '../Icon/index';

class AcceptedStepItem extends Component {
  handlePress = () => {
    const { dispatch, step } = this.props;
    dispatch(navigatePush(STEP_DETAIL_SCREEN, { step }));
  };

  render() {
    const {
      step: { body },
    } = this.props;

    return (
      <Card onPress={this.handlePress} style={styles.card}>
        <View flex={1} flexDirection={'row'}>
          <View flex={1} flexDirection={'column'}>
            <Text>REMINDER</Text>
            <Text style={styles.stepText}>{body}</Text>
          </View>
          <IconButton
            style={styles.completeIcon}
            name="deleteIcon"
            type="MissionHub"
            onPress={this.handlePress}
          />
        </View>
      </Card>
    );
  }
}

AcceptedStepItem.propTypes = {
  step: PropTypes.shape({
    body: PropTypes.string.isRequired,
  }).isRequired,
};

export default connect()(AcceptedStepItem);
