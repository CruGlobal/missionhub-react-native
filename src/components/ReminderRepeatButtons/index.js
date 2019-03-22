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
    recurrence: ONCE,
  };

  componentDidMount() {
    this.props.onRecurrenceChange(ONCE);
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

  renderReminderButton(recurrence, i18nKey, onPress) {
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
        text={t(i18nKey)}
        onPress={onPress}
      />
    );
  }

  render() {
    const { container } = styles;

    return (
      <View style={container}>
        {this.renderReminderButton(DAILY, 'daily', this.handleSetDaily)}
        {this.renderReminderButton(WEEKLY, 'weekly', this.handleSetWeekly)}
        {this.renderReminderButton(MONTHLY, 'monthly', this.handleSetMonthly)}
      </View>
    );
  }
}
