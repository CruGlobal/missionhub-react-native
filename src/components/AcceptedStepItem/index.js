import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import GREY_CHECKBOX from '../../../assets/images/checkIcon-grey.png';
import BLUE_CHECKBOX from '../../../assets/images/checkIcon-blue.png';
import { Text, Card, Button } from '../common';
import ReminderButton from '../ReminderButton';
import ReminderDateText from '../ReminderDateText';
import { completeStep } from '../../actions/steps';
import { navigatePush } from '../../actions/navigation';
import { ACCEPTED_STEP_DETAIL_SCREEN } from '../../containers/AcceptedStepDetailScreen';
import { reminderSelector } from '../../selectors/stepReminders';
import { CONTACT_STEPS } from '../../constants';
import { COMPLETED_STEP_DETAIL_SCREEN } from '../../containers/CompletedStepDetailScreen';
import Icon from '../Icon/index';

import styles from './styles';

class AcceptedStepItem extends Component {
  handleNavigateAcceptedDetailScreen = () => {
    const { dispatch, step } = this.props;
    dispatch(navigatePush(ACCEPTED_STEP_DETAIL_SCREEN, { step }));
  };
  handleNavigateCompletedDetailScreen = () => {
    const { dispatch, step } = this.props;
    dispatch(navigatePush(COMPLETED_STEP_DETAIL_SCREEN, { step }));
  };

  handleCompleteStep = async () => {
    const { dispatch, step, onComplete } = this.props;

    await dispatch(completeStep(step, CONTACT_STEPS));
    onComplete && onComplete();
  };

  render() {
    const {
      step: { title, completed_at, id },
      reminder,
    } = this.props;
    const {
      card,
      stepText,
      stepTextCompleted,
      iconButton,
      checkIcon,
      reminderButton,
      bellIcon,
    } = styles;

    return completed_at ? (
      <Card
        flex={1}
        flexDirection="row"
        alignItems="center"
        onPress={this.handleNavigateCompletedDetailScreen}
        style={card}
      >
        <View flex={1} flexDirection="column">
          <Text style={[stepText, stepTextCompleted]}>{title}</Text>
        </View>
        <Image source={GREY_CHECKBOX} style={checkIcon} />
      </Card>
    ) : (
      <Card
        flex={1}
        flexDirection="row"
        alignItems="center"
        onPress={this.handleNavigateAcceptedDetailScreen}
        style={card}
      >
        <View flex={1} flexDirection="column">
          <ReminderButton stepId={id} reminder={reminder}>
            <View flexDirection="row" style={reminderButton}>
              <Icon name="bellIcon" type="MissionHub" style={bellIcon} />
              <ReminderDateText reminder={reminder} />
            </View>
          </ReminderButton>
          <Text style={stepText}>{title}</Text>
        </View>
        <Button onPress={this.handleCompleteStep} style={iconButton}>
          <Image source={BLUE_CHECKBOX} style={checkIcon} />
        </Button>
      </Card>
    );
  }
}

AcceptedStepItem.propTypes = {
  step: PropTypes.shape({
    title: PropTypes.string.isRequired,
    completed_at: PropTypes.string,
  }).isRequired,
  onComplete: PropTypes.func,
};

const mapStateToProps = ({ stepReminders }, { step }) => ({
  reminder: reminderSelector({ stepReminders }, { stepId: step.id }),
});

export default connect(mapStateToProps)(AcceptedStepItem);
