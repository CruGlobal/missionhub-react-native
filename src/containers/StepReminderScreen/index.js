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
import Header from '../Header';
import DatePicker from '../../components/DatePicker';
import BottomButton from '../../components/BottomButton';
import { Button, Text } from '../../components/common';
import { navigateBack } from '../../actions/navigation';

import styles from './styles';

@translate('stepReminder')
class StepReminderScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: props.date,
      disableBtn: true,
    };

    this.today = new Date();
  }

  handleChangeDate = date => {
    console.log(date);
    if (!date) {
      this.setState({ date: '', disableBtn: true });
    } else {
      this.setState({ date, disableBtn: false });
    }
  };

  handleSetReminder = () => {
    this.props.dispatch(navigateBack());
  };

  renderHeader() {
    const { header, backButton, headerText } = styles;

    return (
      <Header
        style={header}
        shadow={false}
        left={<BackButton iconStyle={backButton} />}
        center={<Text style={headerText}>{this.props.t('setReminder')}</Text>}
      />
    );
  }

  renderDateInput() {
    const { t, placeholder, customStyles, disabled } = this.props;
    const { date } = this.state;
    const {
      dateInputContainer,
      inputHeaderText,
      inputContentText,
      inputTextInactive,
      inputTextFull,
    } = styles;

    const inputHeaderStyle = [inputHeaderText, date ? inputTextInactive : null];
    const inputContentStyle = [
      inputContentText,
      date ? inputTextFull : inputTextInactive,
    ];

    return (
      <View style={dateInputContainer}>
        <Text style={inputHeaderStyle}>{t('endDate')}</Text>
        <DatePicker
          date={date}
          mode="datetime"
          minDate={this.today}
          onDateChange={this.handleChangeDate}
        >
          <Text style={inputContentStyle}>
            {!date ? t('endDatePlaceholder') : date}
          </Text>
        </DatePicker>
      </View>
    );
  }

  renderRepeatButtons() {
    const { t } = this.props;
    const {
      buttonContainer,
      button,
      buttonInactive,
      buttonActive,
      buttonText,
      buttonTextInactive,
      buttonTextActive,
    } = styles;

    return (
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
    );
  }

  render() {
    const { t } = this.props;
    const { container, inputContainer } = styles;

    return (
      <View style={container}>
        {this.renderHeader()}
        <View style={inputContainer}>
          {this.renderDateInput()}
          {this.renderRepeatButtons()}
        </View>
        <BottomButton
          disabled={this.state.disableBtn}
          text={t('done')}
          onPress={this.handleSetReminder}
        />
      </View>
    );
  }
}

export default connect()(StepReminderScreen);

export const STEP_REMINDER_SCREEN = 'nav/STEP_REMINDER';
