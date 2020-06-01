import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';

import DeprecatedBackButton from '../DeprecatedBackButton';
import Header from '../../components/Header';
import DatePicker from '../../components/DatePicker';
import BottomButton from '../../components/BottomButton';
import ReminderRepeatButtons from '../../components/ReminderRepeatButtons';
import ReminderDateText from '../../components/ReminderDateText';
import { Text } from '../../components/common';
import { navigateBack } from '../../actions/navigation';
import { createStepReminder } from '../../actions/stepReminders';
import { ReminderTypeEnum } from '../../../__generated__/globalTypes';
import { StepItem_reminder as ReminderType } from '../../components/StepItem/__generated__/StepItem';

import styles from './styles';

const StepReminderScreen = () => {
  const { t } = useTranslation('stepReminder');
  const reminder: ReminderType = useNavigationParam('reminder');
  const stepId = useNavigationParam('stepId');
  const dispatch = useDispatch();

  const [date, setDate] = useState<Date | string>(
    (reminder && reminder.nextOccurrenceAt) || '',
  );

  const [disableBtn, setDisableBtn] = useState<boolean>(
    !(reminder && reminder.nextOccurrenceAt),
  );

  const [recurrence, setRecurrence] = useState<ReminderTypeEnum>(
    reminder && reminder.reminderType,
  );

  const handleChangeDate = (date: Date) => {
    if (!date) {
      setDate('');
      setDisableBtn(true);
    } else {
      setDate(date);
      setDisableBtn(false);
    }
  };

  const handleSetReminder = () => {
    dispatch(navigateBack());
    date &&
      dispatch(
        createStepReminder(
          stepId,
          new Date(date),
          recurrence ? recurrence : ReminderTypeEnum.once,
        ),
      );
  };

  const handleRecurrenceChange = (recurrence: ReminderTypeEnum) => {
    setRecurrence(recurrence);
  };

  const renderHeader = () => {
    const { backButton, headerText } = styles;

    return (
      <Header
        left={<DeprecatedBackButton iconStyle={backButton} />}
        center={<Text style={headerText}>{t('setReminder')}</Text>}
      />
    );
  };

  const renderDateInput = () => {
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
      reminderType: recurrence || ReminderTypeEnum.once,
      nextOccurrenceAt: date,
    };

    return (
      <View style={dateInputContainer}>
        <Text style={inputHeaderStyle}>{t('endDate')}</Text>
        <DatePicker
          // @ts-ignore
          testID="datePicker"
          // @ts-ignore
          date={date}
          mode="datetime"
          minDate={today}
          onDateChange={handleChangeDate}
        >
          <View>
            <ReminderDateText
              style={inputContentStyle}
              // @ts-ignore
              reminder={sampleReminder}
              placeholder={t('endDatePlaceholder')}
            />
          </View>
        </DatePicker>
      </View>
    );
  };
  const { container, inputContainer } = styles;
  return (
    <View style={container}>
      {renderHeader()}
      <View style={inputContainer}>
        {renderDateInput()}
        <ReminderRepeatButtons
          // @ts-ignore
          testID="reminderRepeatButtons"
          recurrence={recurrence}
          onRecurrenceChange={handleRecurrenceChange}
        />
      </View>
      <BottomButton
        testID="setReminderButton"
        disabled={disableBtn}
        text={t('done')}
        onPress={handleSetReminder}
      />
    </View>
  );
};

export default StepReminderScreen;
export const STEP_REMINDER_SCREEN = 'nav/STEP_REMINDER';
