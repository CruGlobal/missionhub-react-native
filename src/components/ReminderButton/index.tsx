import React, { useState, ReactNode } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import gql from 'graphql-tag';

import { NOTIFICATION_PROMPT_TYPES } from '../../constants';
import ReminderRepeatButtons from '../ReminderRepeatButtons';
import { navigatePush } from '../../actions/navigation';
import { STEP_REMINDER_SCREEN } from '../../containers/StepReminderScreen';
import DatePicker from '../DatePicker';
import {
  showNotificationPrompt,
  requestNativePermissions,
} from '../../actions/notifications';
import { createStepReminder } from '../../actions/stepReminders';
import { ReminderTypeEnum } from '../../../__generated__/globalTypes';

import { ReminderButton as Reminder } from './__generated__/ReminderButton';

export const REMINDER_BUTTON_FRAGMENT = gql`
  fragment ReminderButton on StepReminder {
    id
    nextOccurrenceAt
    reminderType
  }
`;

export interface ReminderButtonProps {
  stepId: string;
  reminder: Reminder | null;
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, null, never>;
  testID?: string;
}
const ReminderButton = ({
  dispatch,
  stepId,
  reminder,
  children,
}: ReminderButtonProps) => {
  const { nextOccurrenceAt, reminderType } = reminder || {
    nextOccurrenceAt: undefined,
    reminderType: undefined,
  };
  const [recurrence, setRecurrence] = useState(reminderType);
  // for Android, request notifications, then navigate to step reminder screen
  const handlePressAndroid = () => {
    dispatch(requestNativePermissions());
    dispatch(navigatePush(STEP_REMINDER_SCREEN, { stepId }));
  };
  // for iOS, ask for notifications, navigate to step reminder screen
  const handlePressIOS = async ({ showPicker }: { showPicker: Function }) => {
    const { acceptedNotifications } = await dispatch(
      showNotificationPrompt(NOTIFICATION_PROMPT_TYPES.SET_REMINDER),
    );
    acceptedNotifications && showPicker();
  };
  const handleChangeDate = (date: Date) => {
    dispatch(createStepReminder(stepId, date, recurrence));
  };
  const onRecurrenceChange = (rec: ReminderTypeEnum) => {
    setRecurrence(rec);
  };
  const today = new Date();
  return (
    <DatePicker
      testID="ReminderDatePicker"
      date={nextOccurrenceAt}
      minDate={today}
      onPressAndroid={handlePressAndroid}
      onPressIOS={handlePressIOS}
      onDateChange={handleChangeDate}
      iOSModalContent={
        <ReminderRepeatButtons
          recurrence={recurrence}
          onRecurrenceChange={onRecurrenceChange}
        />
      }
      height={378}
      mode="datetime"
    >
      {children}
    </DatePicker>
  );
};

export default connect()(ReminderButton);
