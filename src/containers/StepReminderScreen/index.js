import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  DatePickerAndroid,
  TimePickerAndroid,
  DatePickerIOS,
  Animated,
  Keyboard,
} from 'react-native';
import moment from 'moment';
import { translate } from 'react-i18next';

import BackButton from '../BackButton';
import DatePicker from '../../components/DatePicker';
import BottomButton from '../../components/BottomButton';
import { Button } from '../../components/common';

import styles from './styles';

@translate('stepReminder')
class StepReminderScreen extends Component {
  render() {
    const { t } = this.props;
    const {
      container,
      buttonContainer,
      button,
      buttonInactive,
      buttonActive,
      buttonText,
      buttonTextInactive,
      buttonTextActive,
    } = styles;

    return (
      <View style={container}>
        <DatePicker />
        <View style={buttonContainer}>
          <Button
            style={[button, buttonInactive]}
            buttonTextStyle={[buttonText, buttonTextInactive]}
            text={t('daily')}
          />
          <Button
            style={[button, buttonActive]}
            buttonTextStyle={[buttonText, buttonTextActive]}
            text={t('weekly')}
          />
          <Button
            style={[button, buttonInactive]}
            buttonTextStyle={[buttonText, buttonTextInactive]}
            text={t('monthly')}
          />
        </View>
        <BottomButton text={t('done')} />
        <BackButton absolute={true} />
      </View>
    );
  }
}

export default connect()(StepReminderScreen);

export const STEP_REMINDER_SCREEN = 'nav/STEP_REMINDER';
