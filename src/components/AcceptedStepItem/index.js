import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import GREY_CHECKBOX from '../../../assets/images/checkIcon-grey.png';
import BLUE_CHECKBOX from '../../../assets/images/checkIcon-blue.png';
import { Text, Card, Button } from '../common';
import DatePicker from '../DatePicker';
import ReminderRepeatButtons from '../ReminderRepeatButtons';
import { completeStep } from '../../actions/steps';
import { navigatePush } from '../../actions/navigation';
import { ACCEPTED_STEP_DETAIL_SCREEN } from '../../containers/AcceptedStepDetailScreen';
import { CONTACT_STEPS } from '../../constants';
import Icon from '../Icon/index';

import styles from './styles';

@translate('contactSteps')
class AcceptedStepItem extends Component {
  handleNavigate = () => {
    const { dispatch, step } = this.props;
    dispatch(navigatePush(ACCEPTED_STEP_DETAIL_SCREEN, { step }));
  };

  handleCompleteStep = async () => {
    const { dispatch, step, onComplete } = this.props;

    await dispatch(completeStep(step, CONTACT_STEPS));
    onComplete && onComplete();
  };

  handleSetReminder = () => {};

  render() {
    const {
      t,
      step: { title, completed_at },
    } = this.props;
    const {
      card,
      reminderButton,
      bellIcon,
      reminderText,
      stepText,
      iconButton,
      checkIcon,
    } = styles;

    return (
      <Card
        flex={1}
        flexDirection="row"
        alignItems="center"
        onPress={this.handleNavigate}
        style={card}
      >
        <View flex={1} flexDirection="column">
          <DatePicker
            onChangeDate={this.handleSetReminder}
            iOSModalContent={<ReminderRepeatButtons />}
            height={378}
          >
            <View flexDirection="row" style={reminderButton}>
              <Icon name="bellIcon" type="MissionHub" style={bellIcon} />
              <Text style={reminderText}>{t('setReminder')}</Text>
            </View>
          </DatePicker>
          <Text style={stepText}>{title}</Text>
        </View>
        <Button onPress={this.handleCompleteStep} style={iconButton}>
          <Image
            source={completed_at ? GREY_CHECKBOX : BLUE_CHECKBOX}
            style={checkIcon}
          />
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

export default connect()(AcceptedStepItem);
