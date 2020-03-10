import React from 'react';
import { fireEvent } from 'react-native-testing-library';
import MockDate from 'mockdate';

import { renderWithContext } from '../../../../testUtils';
import { navigateBack } from '../../../actions/navigation';
import { createStepReminder } from '../../../actions/stepReminders';
import { ReminderTypeEnum } from '../../../../__generated__/globalTypes';

import StepReminderScreen from '..';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/stepReminders');
jest.mock('../../../selectors/stepReminders');
jest.mock('../../../components/DatePicker', () => 'DatePicker');

const mockDate = '2018-09-01';
MockDate.set(mockDate);

const stepId = '42234';
const reminderId = '1';
const reminder = {
  id: reminderId,
  reminderType: ReminderTypeEnum.once,
  nextOccurrenceAt: mockDate,
};

const navigateBackResult = { type: 'navigated back' };
const createStepReminderResult = { type: 'created step reminder' };

(navigateBack as jest.Mock).mockReturnValue(navigateBackResult);
(createStepReminder as jest.Mock).mockReturnValue(createStepReminderResult);

describe('render', () => {
  describe('reminder in props', () => {
    it('renders correctly', () => {
      renderWithContext(<StepReminderScreen />, {
        navParams: {
          reminder,
          stepId,
        },
      }).snapshot();
    });
  });

  describe('no reminder in props', () => {
    it('renders correctly', () => {
      renderWithContext(<StepReminderScreen />, {
        navParams: {
          reminder: null,
          stepId,
        },
      }).snapshot();
    });
  });
});

describe('handleChangeDate', () => {
  const newDate = '2020-03-10';
  describe('date passed in', () => {
    it('sets new state and renders', () => {
      const { getByTestId, snapshot } = renderWithContext(
        <StepReminderScreen />,
        {
          navParams: {
            reminder,
            stepId,
          },
        },
      );
      fireEvent(getByTestId('datePicker'), 'onDateChange', newDate);

      snapshot();
    });
  });

  describe('date not passed in', () => {
    it('sets new state and renders', () => {
      const newDate = '2020-03-10';
      const { getByTestId, snapshot } = renderWithContext(
        <StepReminderScreen />,
        {
          navParams: {
            reminder: null,
            stepId,
          },
        },
      );
      fireEvent(getByTestId('datePicker'), 'onDateChange', newDate);

      snapshot();
    });
  });

  describe('handleRecurrenceChange', () => {
    describe('reminder passed in', () => {
      it('sets new state', () => {
        const { getByTestId, snapshot } = renderWithContext(
          <StepReminderScreen />,
          {
            navParams: {
              reminder,
              stepId,
            },
          },
        );
        fireEvent(
          getByTestId('reminderRepeatButtons'),
          'onRecurrenceChange',
          ReminderTypeEnum.daily,
        );

        snapshot();
      });
    });

    describe('reminder not passed in', () => {
      it('sets new state', () => {
        const { getByTestId, snapshot } = renderWithContext(
          <StepReminderScreen />,
          {
            navParams: {
              reminder: null,
              stepId,
            },
          },
        );
        fireEvent(
          getByTestId('reminderRepeatButtons'),
          'onRecurrenceChange',
          ReminderTypeEnum.daily,
        );

        snapshot();
      });
    });
  });

  describe('handleSetReminder', () => {
    describe('reminder not passed in', () => {
      it('calls createStepReminder and navigates back', async () => {
        const { getByTestId, snapshot } = renderWithContext(
          <StepReminderScreen />,
          {
            navParams: {
              reminder: null,
              stepId,
            },
          },
        );

        await fireEvent(getByTestId('datePicker'), 'onDateChange', newDate);
        await fireEvent(
          getByTestId('reminderRepeatButtons'),
          'onRecurrenceChange',
          ReminderTypeEnum.daily,
        );
        await fireEvent(getByTestId('setReminderButton'), 'onPress');

        expect(navigateBack).toHaveBeenCalled();
        expect(createStepReminder).toHaveBeenCalledWith(
          stepId,
          newDate,
          ReminderTypeEnum.daily,
        );
        snapshot();
      });

      it('calls createStepReminder without recurrence', async () => {
        const { getByTestId, snapshot } = renderWithContext(
          <StepReminderScreen />,
          {
            navParams: {
              reminder: null,
              stepId,
            },
          },
        );

        await fireEvent(getByTestId('datePicker'), 'onDateChange', newDate);

        await fireEvent(getByTestId('setReminderButton'), 'onPress');

        expect(navigateBack).toHaveBeenCalled();
        expect(createStepReminder).toHaveBeenCalledWith(
          stepId,
          newDate,
          ReminderTypeEnum.once,
        );
        snapshot();
      });
    });

    describe('reminder passed in', () => {
      it('calls createStepReminder and navigates back', async () => {
        const { getByTestId, snapshot } = renderWithContext(
          <StepReminderScreen />,
          {
            navParams: {
              reminder,
              stepId,
            },
          },
        );

        await fireEvent(getByTestId('setReminderButton'), 'onPress');

        expect(navigateBack).toHaveBeenCalled();
        expect(createStepReminder).toHaveBeenCalledWith(
          stepId,
          reminder.nextOccurrenceAt,
          reminder.reminderType,
        );
        snapshot();
      });
    });
  });
});
