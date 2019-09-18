import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '../common';
import {
  REMINDER_RECURRENCES,
  REMINDER_RECURRENCES_ENUM,
} from '../../constants';

import styles from './styles';

const { ONCE, DAILY, WEEKLY, MONTHLY } = REMINDER_RECURRENCES;

interface ReminderRepeatButtonsProps {
  recurrence?: REMINDER_RECURRENCES_ENUM;
  onRecurrenceChange: Function;
}

const ReminderRepeatButtons = ({
  recurrence: currentRecurrence,
  onRecurrenceChange,
}: ReminderRepeatButtonsProps) => {
  const { t } = useTranslation('stepReminder');
  function setButtonState(clickedRecurrence: REMINDER_RECURRENCES_ENUM) {
    const recurrence =
      currentRecurrence === clickedRecurrence ? ONCE : clickedRecurrence;
    onRecurrenceChange(recurrence);
  }
  const handleSetDaily = () => setButtonState(DAILY);
  const handleSetWeekly = () => setButtonState(WEEKLY);
  const handleSetMonthly = () => setButtonState(MONTHLY);
  function renderReminderButton(
    recurrence: REMINDER_RECURRENCES_ENUM,
    onPress: Function,
  ) {
    const {
      button,
      buttonInactive,
      buttonActive,
      buttonText,
      buttonTextInactive,
      buttonTextActive,
    } = styles;
    const active = currentRecurrence === recurrence;

    return (
      <Button
        testID={
          recurrence === DAILY
            ? 'ReminderRepeatButtonDaily'
            : recurrence === WEEKLY
            ? 'ReminderRepeatButtonWeekly'
            : 'ReminderRepeatButtonMonthly'
        }
        style={[button, active ? buttonActive : buttonInactive]}
        buttonTextStyle={[
          buttonText,
          active ? buttonTextActive : buttonTextInactive,
        ]}
        text={t(recurrence)}
        onPress={onPress}
      />
    );
  }
  const { container } = styles;
  return (
    <View style={container}>
      {renderReminderButton(DAILY, handleSetDaily)}
      {renderReminderButton(WEEKLY, handleSetWeekly)}
      {renderReminderButton(MONTHLY, handleSetMonthly)}
    </View>
  );
};

export default ReminderRepeatButtons;
