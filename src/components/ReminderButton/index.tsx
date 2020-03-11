import React, { useState, ReactNode } from 'react';
import { connect } from 'react-redux-legacy';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { NOTIFICATION_PROMPT_TYPES } from '../../constants';
import ReminderRepeatButtons from '../ReminderRepeatButtons';
import { navigatePush, navigateBack } from '../../actions/navigation';
import { STEP_REMINDER_SCREEN } from '../../containers/StepReminderScreen';
import DatePicker from '../DatePicker';
import {
  requestNativePermissions,
  checkNotifications,
} from '../../actions/notifications';
import { createStepReminder } from '../../actions/stepReminders';
import { AuthState } from '../../reducers/auth';
import { NotificationsState } from '../../reducers/notifications';
import { ReminderTypeEnum } from '../../../__generated__/globalTypes';

import { ReminderButton as Reminder } from './__generated__/ReminderButton';

export interface ReminderButtonProps {
  stepId: string;
  reminder: Reminder | null;
  children: ReactNode;
  dispatch: ThunkDispatch<
    { auth: AuthState; notifications: NotificationsState },
    null,
    AnyAction
  >;
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
    dispatch(navigatePush(STEP_REMINDER_SCREEN, { reminder, stepId }));
  };
  // for iOS, ask for notifications, navigate to step reminder screen
  const handlePressIOS = ({ showPicker }: { showPicker: Function }) => {
    dispatch(
      checkNotifications(
        NOTIFICATION_PROMPT_TYPES.SET_REMINDER,
        ({ nativePermissionsEnabled, showedPrompt }) => {
          showedPrompt && dispatch(navigateBack());
          nativePermissionsEnabled && showPicker();
        },
      ),
    );
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
      // @ts-ignore
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
