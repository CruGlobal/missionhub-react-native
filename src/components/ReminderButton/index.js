import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ReminderRepeatButtons from '../ReminderRepeatButtons';
import { navigatePush } from '../../actions/navigation';
import { STEP_REMINDER_SCREEN } from '../../containers/StepReminderScreen';
import DatePicker from '../DatePicker';
import { createStepReminder } from '../../actions/stepReminders';

class ReminderButton extends Component {
  state = {
    date: (this.props.reminder && this.props.reminder.next_occurrence_at) || '',
    recurrence: this.props.reminder && this.props.reminder.reminder_type,
  };

  //for Android, navigate to step reminder screen
  handlePressAndroid = () => {
    const { dispatch, stepId } = this.props;
    dispatch(navigatePush(STEP_REMINDER_SCREEN, { stepId }));
  };

  handleChangeDate = date => {
    const { recurrence } = this.state;
    const { stepId, dispatch } = this.props;

    dispatch(createStepReminder(stepId, date, recurrence));

    this.setState({ date });
  };

  onRecurrenceChange = recurrence => {
    this.setState({ recurrence });
  };

  render() {
    const { recurrence } = this.state;
    const { children, reminder } = this.props;
    const { reminder_type, next_occurrence_at } = reminder || {};

    const today = new Date();

    return (
      <DatePicker
        date={next_occurrence_at}
        minDate={today}
        onPressAndroid={this.handlePressAndroid}
        onDateChange={this.handleChangeDate}
        iOSModalContent={
          <ReminderRepeatButtons
            initialRecurrence={reminder_type}
            recurrence={recurrence}
            onRecurrenceChange={this.onRecurrenceChange}
          />
        }
        height={378}
        mode="datetime"
      >
        {children}
      </DatePicker>
    );
  }
}

ReminderButton.propTypes = {
  stepId: PropTypes.string.isRequired,
  reminder: PropTypes.object,
};

export default connect()(ReminderButton);
