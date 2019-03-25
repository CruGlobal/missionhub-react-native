import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { translate } from 'react-i18next';
import moment from 'moment';

import BackButton from '../BackButton';
import Header from '../Header';
import DatePicker from '../../components/DatePicker';
import BottomButton from '../../components/BottomButton';
import ReminderRepeatButtons from '../../components/ReminderRepeatButtons';
import ReminderDateText from '../../components/ReminderDateText';
import { Text } from '../../components/common';
import { navigateBack } from '../../actions/navigation';
import { createStepReminder } from '../../actions/stepReminders';
import { reminderSelector } from '../../selectors/stepReminders';

import styles from './styles';

@translate('stepReminder')
class StepReminderScreen extends Component {
  state = {
    date: this.props.date,
    disableBtn: true,
    recurrence: null,
  };

  today = new Date();

  handleChangeDate = date => {
    if (!date) {
      this.setState({ date: '', disableBtn: true });
    } else {
      this.setState({ date, disableBtn: false });
    }
  };

  handleSetReminder = () => {
    const { dispatch, stepId } = this.props;
    const { date, recurrence } = this.state;

    dispatch(navigateBack());
    dispatch(createStepReminder(stepId, date, recurrence));
  };

  onRecurrenceChange = recurrence => {
    this.setState({ recurrence });
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
    const { t, reminder } = this.props;
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
          <ReminderDateText style={inputContentStyle} reminder={reminder} />
        </DatePicker>
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
          <ReminderRepeatButtons onRecurrenceChange={this.onRecurrenceChange} />
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

const mapStateToProps = (
  { stepReminders },
  {
    navigation: {
      state: {
        params: { stepId },
      },
    },
  },
) => ({
  stepId,
  reminder: reminderSelector({ stepReminders }, { stepId }),
});
export default connect(mapStateToProps)(StepReminderScreen);
export const STEP_REMINDER_SCREEN = 'nav/STEP_REMINDER';
