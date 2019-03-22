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

  renderReminderButton() {}

  render() {
    const { t } = this.props;
    const { recurrence } = this.state;
    const {
      container,
      button,
      buttonInactive,
      buttonActive,
      buttonText,
      buttonTextInactive,
      buttonTextActive,
    } = styles;

    //todo refactor
    return (
      <View style={container}>
        <Button
          style={[button, recurrence === DAILY ? buttonActive : buttonInactive]}
          buttonTextStyle={[
            buttonText,
            recurrence === DAILY ? buttonTextActive : buttonTextInactive,
          ]}
          text={t('daily')}
          onPress={this.handleSetDaily}
        />
        <Button
          style={[
            button,
            recurrence === WEEKLY ? buttonActive : buttonInactive,
          ]}
          buttonTextStyle={[
            buttonText,
            recurrence === WEEKLY ? buttonTextActive : buttonTextInactive,
          ]}
          text={t('weekly')}
          onPress={this.handleSetWeekly}
        />
        <Button
          style={[
            button,
            recurrence === MONTHLY ? buttonActive : buttonInactive,
          ]}
          buttonTextStyle={[
            buttonText,
            recurrence === MONTHLY ? buttonTextActive : buttonTextInactive,
          ]}
          text={t('monthly')}
          onPress={this.handleSetMonthly}
        />
      </View>
    );
  }
}
