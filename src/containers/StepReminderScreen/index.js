import React, { Component } from 'react';
import { connect } from 'react-redux-legacy';
import { View } from 'react-native';
import { withTranslation } from 'react-i18next';

import BackButton from '../BackButton';
import Header from '../../components/Header';
import DatePicker from '../../components/DatePicker';
import BottomButton from '../../components/BottomButton';
import ReminderRepeatButtons from '../../components/ReminderRepeatButtons';
import ReminderDateText from '../../components/ReminderDateText';
import { Text } from '../../components/common';
import { navigateBack } from '../../actions/navigation';
import { createStepReminder } from '../../actions/stepReminders';
import { reminderSelector } from '../../selectors/stepReminders';
import { REMINDER_RECURRENCES } from '../../constants';

import styles from './styles';

@withTranslation('stepReminder')
class StepReminderScreen extends Component {
  state = {
    date: (this.props.reminder && this.props.reminder.next_occurrence_at) || '',
    disableBtn: !(
      this.props.reminder && this.props.reminder.next_occurrence_at
    ),
    recurrence: this.props.reminder && this.props.reminder.reminder_type,
  };

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

  handleRecurrenceChange = recurrence => {
    this.setState({ recurrence });
  };

  renderHeader() {
    const { backButton, headerText } = styles;

    return (
      <Header
        left={<BackButton iconStyle={backButton} />}
        center={<Text style={headerText}>{this.props.t('setReminder')}</Text>}
      />
    );
  }

  renderDateInput() {
    const { t } = this.props;
    const { date, recurrence } = this.state;
    const {
      dateInputContainer,
      inputHeaderText,
      inputContentText,
      inputTextInactive,
      inputTextFull,
    } = styles;

    const today = new Date();

    const inputHeaderStyle = [inputHeaderText, date ? inputTextInactive : null];
    const inputContentStyle = [
      inputContentText,
      date ? inputTextFull : inputTextInactive,
    ];

    const sampleReminder = date && {
      type: recurrence || REMINDER_RECURRENCES.ONCE,
      next_occurrence_at: date,
    };

    return (
      <View style={dateInputContainer}>
        <Text style={inputHeaderStyle}>{t('endDate')}</Text>
        <DatePicker
          date={date}
          mode="datetime"
          minDate={today}
          onDateChange={this.handleChangeDate}
        >
          <View>
            <ReminderDateText
              style={inputContentStyle}
              reminder={sampleReminder}
              placeholder={t('endDatePlaceholder')}
            />
          </View>
        </DatePicker>
      </View>
    );
  }

  render() {
    const { t } = this.props;
    const { recurrence } = this.state;
    const { container, inputContainer } = styles;

    return (
      <View style={container}>
        {this.renderHeader()}
        <View style={inputContainer}>
          {this.renderDateInput()}
          <ReminderRepeatButtons
            recurrence={recurrence}
            onRecurrenceChange={this.handleRecurrenceChange}
          />
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
