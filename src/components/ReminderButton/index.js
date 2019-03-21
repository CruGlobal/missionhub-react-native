import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { Icon, Text, Button } from '../common';
import ReminderRepeatButtons from '../ReminderRepeatButtons';
import { navigatePush } from '../../actions/navigation';
import { STEP_REMINDER_SCREEN } from '../../containers/StepReminderScreen';
import DatePicker from '../DatePicker';
import { createStepReminder } from '../../actions/stepReminders';
import styles from './styles';

@translate('stepReminder')
class ReminderButton extends Component {
  state = {
    occurence: null,
  };

  //for Android, navigate to step reminder screen
  handlePressAndroid = () => {
    const { dispatch, stepId } = this.props;
    dispatch(navigatePush(STEP_REMINDER_SCREEN, { stepId }));
  };

  handleRemoveReminder = () => {};

  handleChangeDate = date => {
    const { occurence } = this.state;
    const { stepId, dispatch } = this.props;

    if (occurence) {
      console.log(occurence);
      dispatch(createStepReminder(stepId, date, occurence));
    } else {
      console.log('no recurrence');
      dispatch(createStepReminder(stepId, date));
    }
  };

  render() {
    const { t } = this.props;
    const {
      reminderButton,
      reminderContainer,
      reminderIconCircle,
      reminderIcon,
      reminderText,
      cancelIconButton,
      cancelIcon,
    } = styles;

    return (
      <DatePicker
        onPressAndroid={this.handlePressAndroid}
        onDateChange={this.handleChangeDate}
        iOSModalContent={<ReminderRepeatButtons />}
        height={378}
        mode="datetime"
      >
        <View style={reminderButton}>
          <View style={reminderContainer}>
            <View style={reminderIconCircle}>
              <Icon name="bellIcon" type="MissionHub" style={reminderIcon} />
            </View>
            <Text style={reminderText}>{t('setReminder')}</Text>
          </View>
          <Button onPress={this.handleRemoveReminder} style={cancelIconButton}>
            <Icon name="close" type="Material" style={cancelIcon} />
          </Button>
        </View>
      </DatePicker>
    );
  }
}

export default connect()(ReminderButton);
