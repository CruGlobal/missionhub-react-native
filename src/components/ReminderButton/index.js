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
    recurrence: null,
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

    this.setState({ recurrence: null });
  };

  onRecurrenceChange = recurrence => {
    this.setState({ recurrence });
  };

  render() {
    const { children } = this.props;

    return (
      <DatePicker
        onPressAndroid={this.handlePressAndroid}
        onDateChange={this.handleChangeDate}
        iOSModalContent={
          <ReminderRepeatButtons onRecurrenceChange={this.onRecurrenceChange} />
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
  reminder: PropTypes.object.isRequired,
};

export default connect()(ReminderButton);
