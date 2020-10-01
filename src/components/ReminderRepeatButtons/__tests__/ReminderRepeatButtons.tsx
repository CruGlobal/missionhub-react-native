import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { ReminderTypeEnum } from '../../../../__generated__/globalTypes';
import ReminderRepeatButtons from '..';

const onRecurrenceChange = jest.fn();

describe('none selected', () => {
  it('renders with none highlighted', () => {
    renderWithContext(
      <ReminderRepeatButtons onRecurrenceChange={onRecurrenceChange} />,
    ).snapshot();
  });

  describe('select daily button', () => {
    it('calls onRecurrenceChange with DAILY', () => {
      const { getByTestId } = renderWithContext(
        <ReminderRepeatButtons onRecurrenceChange={onRecurrenceChange} />,
      );

      fireEvent.press(getByTestId('ReminderRepeatButtonDaily'));

      expect(onRecurrenceChange).toHaveBeenCalledTimes(1);
      expect(onRecurrenceChange).toHaveBeenCalledWith(ReminderTypeEnum.daily);
    });
  });
});

describe('starts with weekly selected', () => {
  it('renders with weekly highlighted', () => {
    renderWithContext(
      <ReminderRepeatButtons
        recurrence={ReminderTypeEnum.weekly}
        onRecurrenceChange={onRecurrenceChange}
      />,
    ).snapshot();
  });

  describe('select weekly button', () => {
    it('calls onRecurrenceChange with ONCE', () => {
      const { getByTestId } = renderWithContext(
        <ReminderRepeatButtons
          recurrence={ReminderTypeEnum.weekly}
          onRecurrenceChange={onRecurrenceChange}
        />,
      );

      fireEvent.press(getByTestId('ReminderRepeatButtonWeekly'));

      expect(onRecurrenceChange).toHaveBeenCalledTimes(1);
      expect(onRecurrenceChange).toHaveBeenCalledWith(ReminderTypeEnum.once);
    });
  });

  describe('select other button', () => {
    it('calls onRecurrenceChange with MONTHLY', () => {
      const { getByTestId } = renderWithContext(
        <ReminderRepeatButtons
          recurrence={ReminderTypeEnum.weekly}
          onRecurrenceChange={onRecurrenceChange}
        />,
      );

      fireEvent.press(getByTestId('ReminderRepeatButtonMonthly'));

      expect(onRecurrenceChange).toHaveBeenCalledTimes(1);
      expect(onRecurrenceChange).toHaveBeenCalledWith(ReminderTypeEnum.monthly);
    });
  });
});

describe('starts with daily selected', () => {
  it('renders with daily highlighted', () => {
    renderWithContext(
      <ReminderRepeatButtons
        recurrence={ReminderTypeEnum.daily}
        onRecurrenceChange={onRecurrenceChange}
      />,
    ).snapshot();
  });
});

describe('starts with monthly selected', () => {
  it('renders with monthly highlighted', () => {
    renderWithContext(
      <ReminderRepeatButtons
        recurrence={ReminderTypeEnum.monthly}
        onRecurrenceChange={onRecurrenceChange}
      />,
    ).snapshot();
  });
});
