import React, { useState, ReactNode } from 'react';
import { connect } from 'react-redux-legacy';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { NOTIFICATION_PROMPT_TYPES } from '../../constants';
import ReminderRepeatButtons from '../ReminderRepeatButtons';
import { navigatePush, navigateBack } from '../../actions/navigation';
import { STEP_REMINDER_SCREEN } from '../../containers/StepReminderScreen';
import DatePicker from '../DatePicker';
import { checkNotifications } from '../../actions/notifications';
import { createStepReminder } from '../../actions/stepReminders';
import { AuthState } from '../../reducers/auth';
import { NotificationsState } from '../../reducers/notifications';
import { ReminderTypeEnum } from '../../../__generated__/globalTypes';
import { isAndroid } from '../../utils/common';

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
  const handlePress = ({ showPicker }: { showPicker: () => void }) => {
    dispatch(
      checkNotifications(
        NOTIFICATION_PROMPT_TYPES.SET_REMINDER,
        ({ showedPrompt, nativePermissionsEnabled }) => {
          showedPrompt && dispatch(navigateBack());
          nativePermissionsEnabled && isAndroid
            ? dispatch(navigatePush(STEP_REMINDER_SCREEN, { reminder, stepId }))
            : nativePermissionsEnabled && showPicker();
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
      testID="ReminderDatePicker"
      date={nextOccurrenceAt}
      minimumDate={today}
      onPress={handlePress}
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
