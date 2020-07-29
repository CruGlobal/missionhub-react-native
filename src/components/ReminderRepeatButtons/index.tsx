import React from 'react';
import { GestureResponderEvent, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '../common';
import { ReminderTypeEnum } from '../../../__generated__/globalTypes';

import styles from './styles';

interface ReminderRepeatButtonsProps {
  recurrence?: ReminderTypeEnum;
  onRecurrenceChange: (recurrence: ReminderTypeEnum) => void;
}

const ReminderRepeatButtons = ({
  recurrence: currentRecurrence,
  onRecurrenceChange,
}: ReminderRepeatButtonsProps) => {
  const { t } = useTranslation('stepReminder');
  function setButtonState(clickedRecurrence: ReminderTypeEnum) {
    const recurrence =
      currentRecurrence === clickedRecurrence
        ? ReminderTypeEnum.once
        : clickedRecurrence;
    onRecurrenceChange(recurrence);
  }
  const handleSetDaily = () => setButtonState(ReminderTypeEnum.daily);
  const handleSetWeekly = () => setButtonState(ReminderTypeEnum.weekly);
  const handleSetMonthly = () => setButtonState(ReminderTypeEnum.monthly);
  function renderReminderButton(
    recurrence: ReminderTypeEnum,
    onPress: (event: GestureResponderEvent) => void,
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
          recurrence === ReminderTypeEnum.daily
            ? 'ReminderRepeatButtonDaily'
            : recurrence === ReminderTypeEnum.weekly
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
      {renderReminderButton(ReminderTypeEnum.daily, handleSetDaily)}
      {renderReminderButton(ReminderTypeEnum.weekly, handleSetWeekly)}
      {renderReminderButton(ReminderTypeEnum.monthly, handleSetMonthly)}
    </View>
  );
};

export default ReminderRepeatButtons;
