import React, { Component } from 'react';
import { View } from 'react-native';
import { translate } from 'react-i18next';

import { Button } from '../common';
import { REMINDER_RECURRENCES } from '../../constants';

import styles from './styles';

const { ONCE, DAILY, WEEKLY, MONTHLY } = REMINDER_RECURRENCES;

@translate('stepReminder')
export default class ReminderRepeatButtons extends Component {
  state = {
    recurrence: this.props.recurrence || ONCE,
  };

  componentDidMount() {
    this.props.onRecurrenceChange(this.props.recurrence || ONCE);
  }

  setButtonState(clickedRecurrence) {
    const { recurrence: currentRecurrence } = this.state;
    const recurrence =
      currentRecurrence === clickedRecurrence ? ONCE : clickedRecurrence;

    this.setState({ recurrence });

    this.props.onRecurrenceChange(recurrence);
  }

  handleSetDaily = () => this.setButtonState(DAILY);

  handleSetWeekly = () => this.setButtonState(WEEKLY);

  handleSetMonthly = () => this.setButtonState(MONTHLY);

  renderReminderButton(recurrence, onPress) {
    const { t } = this.props;
    const { recurrence: currentRecurrence } = this.state;
    const {
      button,
      buttonInactive,
      buttonActive,
      buttonText,
      buttonTextInactive,
      buttonTextActive,
    } = styles;

    const active = currentRecurrence === recurrence;

    return (
      <Button
        style={[button, active ? buttonActive : buttonInactive]}
        buttonTextStyle={[
          buttonText,
          active ? buttonTextActive : buttonTextInactive,
        ]}
        text={t(recurrence)}
        onPress={onPress}
      />
    );
  }

  render() {
    const { container } = styles;

    return (
      <View style={container}>
        {this.renderReminderButton(DAILY, this.handleSetDaily)}
        {this.renderReminderButton(WEEKLY, this.handleSetWeekly)}
        {this.renderReminderButton(MONTHLY, this.handleSetMonthly)}
      </View>
    );
  }
}
