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

import styles from './styles';

@translate()
class StepReminderScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <DatePicker />
        <BottomButton text={this.props.t('done')} />
        <BackButton absolute={true} />
      </View>
    );
  }
}

export default connect()(StepReminderScreen);

export const STEP_REMINDER_SCREEN = 'nav/STEP_REMINDER';
