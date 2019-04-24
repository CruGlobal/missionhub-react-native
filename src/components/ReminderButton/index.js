import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ReminderRepeatButtons from '../ReminderRepeatButtons';
import { navigatePush } from '../../actions/navigation';
import { STEP_REMINDER_SCREEN } from '../../containers/StepReminderScreen';
import DatePicker from '../DatePicker';
import {
  showNotificationPrompt,
  requestNativePermissions,
} from '../../actions/notifications';
import { createStepReminder } from '../../actions/stepReminders';

class ReminderButton extends Component {
  state = {
    date: (this.props.reminder && this.props.reminder.next_occurrence_at) || '',
    recurrence: this.props.reminder && this.props.reminder.reminder_type,
  };

  //for Android, request notifications, then navigate to step reminder screen
  handlePressAndroid = () => {
    const { dispatch, stepId } = this.props;
    dispatch(requestNativePermissions());
    dispatch(navigatePush(STEP_REMINDER_SCREEN, { stepId }));
  };

  //for iOS, ask for notifications, navigate to step reminder screen
  handlePressIOS = async ({ showPicker }) => {
    const { dispatch, stepId } = this.props;

    const { acceptedNotifications } = await dispatch(showNotificationPrompt());

    acceptedNotifications && showPicker();
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
    const { next_occurrence_at } = reminder || {};

    const today = new Date();

    return (
      <DatePicker
        date={next_occurrence_at}
        minDate={today}
        onPressAndroid={this.handlePressAndroid}
        onPressIOS={this.handlePressIOS}
        onDateChange={this.handleChangeDate}
        iOSModalContent={
          <ReminderRepeatButtons
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
