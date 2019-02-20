import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Text, Card, IconButton } from '../common';
import { navigatePush } from '../../actions/navigation';
import { STEP_DETAIL_SCREEN } from '../../containers/StepDetailScreen';

import styles from './styles';
import Icon from '../Icon/index';

class AcceptedStepItem extends Component {
  handlePressCard = () => {
    const { dispatch, step } = this.props;
    dispatch(navigatePush(STEP_DETAIL_SCREEN, { step }));
  };

  handlePressIcon = () => {};

  render() {
    const {
      step: { title, completed_at },
    } = this.props;
    const { card, stepText, checkIcon, active, completed } = styles;

    return (
      <Card onPress={this.handlePressCard} style={card}>
        <View flex={1} flexDirection={'row'}>
          <View flex={1} flexDirection={'column'}>
            <Text style={stepText}>REMINDER</Text>
            <Text style={stepText}>{title}</Text>
          </View>
          <IconButton
            style={[checkIcon, completed_at ? completed : active]}
            name="deleteIcon"
            type="MissionHub"
            onPress={this.handlePressIcon}
          />
        </View>
      </Card>
    );
  }
}

AcceptedStepItem.propTypes = {
  step: PropTypes.shape({
    title: PropTypes.string.isRequired,
    completed_at: PropTypes.string,
  }).isRequired,
};

export default connect()(AcceptedStepItem);
