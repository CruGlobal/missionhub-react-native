import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { Icon, Text, Button } from '../common';
import ReminderRepeatButtons from '../ReminderRepeatButtons';
import { navigatePush } from '../../actions/navigation';
import { removeStepReminder } from '../../actions/stepReminders';
import { STEP_REMINDER_SCREEN } from '../../containers/StepReminderScreen';
import DatePicker from '../DatePicker';

import styles from './styles';

@translate('stepReminder')
class ReminderButton extends Component {
  //for Android, navigate to step reminder screen
  handlePressAndroid = () => {
    const { dispatch, step } = this.props;
    dispatch(navigatePush(STEP_REMINDER_SCREEN, { step }));
  };

  handleRemoveReminder = () => {
    const { dispatch, step } = this.props;
    dispatch(removeStepReminder(step.id));
  };

  handleChangeDate = () => {};

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
        onChangeDate={this.handleChangeDate}
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

ReminderButton.propTypes = {
  step: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default connect()(ReminderButton);
