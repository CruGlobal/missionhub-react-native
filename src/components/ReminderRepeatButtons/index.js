import React, { Component } from 'react';
import { View } from 'react-native';
import { translate } from 'react-i18next';

import { Button } from '../common';
import { REMINDER_RECURRENCES } from '../../constants';

import styles from './styles';

const { DAILY, WEEKLY, MONTHLY } = REMINDER_RECURRENCES;

@translate('stepReminder')
export default class ReminderRepeatButtons extends Component {
  state = {
    dailyActive: false,
    weeklyActive: false,
    monthlyActive: false,
  };

  setButtonState(dailyActive, weeklyActive, monthlyActive) {
    this.setState({ dailyActive, weeklyActive, monthlyActive });
  }

  handleSetDaily = () => {
    this.setButtonState(!this.state.dailyActive, false, false);
    this.props.onRecurrenceChange(this.state.dailyActive && DAILY);
  };

  handleSetWeekly = () => {
    this.setButtonState(false, !this.state.weeklyActive, false);
    this.props.onRecurrenceChange(this.state.weeklyActive && WEEKLY);
  };

  handleSetMonthly = () => {
    this.setButtonState(false, false, !this.state.monthlyActive);
    this.props.onRecurrenceChange(this.state.monthlyActive && MONTHLY);
  };

  render() {
    const { t } = this.props;
    const { dailyActive, weeklyActive, monthlyActive } = this.state;
    const {
      container,
      button,
      buttonInactive,
      buttonActive,
      buttonText,
      buttonTextInactive,
      buttonTextActive,
    } = styles;

    return (
      <View style={container}>
        <Button
          style={[button, dailyActive ? buttonActive : buttonInactive]}
          buttonTextStyle={[
            buttonText,
            dailyActive ? buttonTextActive : buttonTextInactive,
          ]}
          text={t('daily')}
          onPress={this.handleSetDaily}
        />
        <Button
          style={[button, weeklyActive ? buttonActive : buttonInactive]}
          buttonTextStyle={[
            buttonText,
            weeklyActive ? buttonTextActive : buttonTextInactive,
          ]}
          text={t('weekly')}
          onPress={this.handleSetWeekly}
        />
        <Button
          style={[button, monthlyActive ? buttonActive : buttonInactive]}
          buttonTextStyle={[
            buttonText,
            monthlyActive ? buttonTextActive : buttonTextInactive,
          ]}
          text={t('monthly')}
          onPress={this.handleSetMonthly}
        />
      </View>
    );
  }
}
