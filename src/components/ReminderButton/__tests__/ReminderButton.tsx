import React from 'react';
import MockDate from 'mockdate';
import { View } from 'react-native';
import { fireEvent } from 'react-native-testing-library';

import {
  NOTIFICATION_PROMPT_TYPES,
  REMINDER_RECURRENCES_ENUM,
} from '../../../constants';
import { renderWithContext } from '../../../../testUtils';
import {
  requestNativePermissions,
  checkNotifications,
} from '../../../actions/notifications';
import { navigatePush, navigateBack } from '../../../actions/navigation';
import { STEP_REMINDER_SCREEN } from '../../../containers/StepReminderScreen';
import { createStepReminder } from '../../../actions/stepReminders';

import ReminderButton from '..';

jest.mock('../../../actions/notifications');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/stepReminders');

const stepId = '1';
const mockDate = '2018-09-12 12:00:00 PM GMT+0';
const reminder = { id: '11', next_occurrence_at: mockDate };

MockDate.set(mockDate);

const requestNotificationsResult = { type: 'requested notifications' };
const navigatePushResult = { type: 'navigated push' };
const navigateBackResult = { type: 'navigated back' };
const createStepReminderResult = { type: 'create step reminder' };

const props = { stepId, dispatch: jest.fn() };

beforeEach(() => {
  (requestNativePermissions as jest.Mock).mockReturnValue(
    requestNotificationsResult,
  );
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResult);
  (navigateBack as jest.Mock).mockReturnValue(navigateBackResult);
  (createStepReminder as jest.Mock).mockReturnValue(createStepReminderResult);
});

describe('reminder passed in', () => {
  it('renders correctly', () => {
    renderWithContext(
      <ReminderButton {...props} reminder={reminder}>
        <View />
      </ReminderButton>,
      { initialState: {} },
    ).snapshot();
  });
});

describe('reminder not passed in', () => {
  it('renders correctly', () => {
    renderWithContext(
      <ReminderButton {...props}>
        <View />
      </ReminderButton>,
      { initialState: {} },
    ).snapshot();
  });
});

describe('handlePressAndroid', () => {
  it('requests notifications and navigates to step reminder screen', () => {
    const { getByTestId } = renderWithContext(
      <ReminderButton {...props} reminder={reminder}>
        <View />
      </ReminderButton>,
      { initialState: {} },
    );
    fireEvent(getByTestId('ReminderDatePicker'), 'onPressAndroid');

    expect(requestNativePermissions).toHaveBeenCalled();
    expect(navigatePush).toHaveBeenCalledWith(STEP_REMINDER_SCREEN, { stepId });
  });
});

describe('handlePressIOS', () => {
  const showPicker = jest.fn();

  it('requests notifications and shows picker', () => {
    (checkNotifications as jest.Mock).mockImplementation(
      (
        _,
        callback: ({
          acceptedNotifications,
          showedPrompt,
        }: {
          acceptedNotifications: boolean;
          showedPrompt: boolean;
        }) => void,
      ) => {
        callback({ acceptedNotifications: true, showedPrompt: false });
        return { type: 'check notifications' };
      },
    );

    const { getByTestId } = renderWithContext(
      <ReminderButton {...props} reminder={reminder}>
        <View />
      </ReminderButton>,
      { initialState: {} },
    );

    fireEvent(getByTestId('ReminderDatePicker'), 'onPressIOS', {
      showPicker,
    });

    expect(checkNotifications).toHaveBeenCalledWith(
      NOTIFICATION_PROMPT_TYPES.SET_REMINDER,
      expect.any(Function),
    );
    expect(navigateBack).not.toHaveBeenCalled();
    expect(showPicker).toHaveBeenCalledWith();
  });

  it('requests notifications, navigates back from prompt screen, and shows picker', () => {
    (checkNotifications as jest.Mock).mockImplementation(
      (
        _,
        callback: ({
          acceptedNotifications,
          showedPrompt,
        }: {
          acceptedNotifications: boolean;
          showedPrompt: boolean;
        }) => void,
      ) => {
        callback({ acceptedNotifications: true, showedPrompt: true });
        return { type: 'check notifications' };
      },
    );

    const { getByTestId } = renderWithContext(
      <ReminderButton {...props} reminder={reminder}>
        <View />
      </ReminderButton>,
      { initialState: {} },
    );

    fireEvent(getByTestId('ReminderDatePicker'), 'onPressIOS', {
      showPicker,
    });

    expect(checkNotifications).toHaveBeenCalledWith(
      NOTIFICATION_PROMPT_TYPES.SET_REMINDER,
      expect.any(Function),
    );
    expect(navigateBack).toHaveBeenCalledWith();
    expect(showPicker).toHaveBeenCalledWith();
  });

  it('declines notifications and does not show picker', () => {
    (checkNotifications as jest.Mock).mockImplementation(
      (
        _,
        callback: ({
          acceptedNotifications,
          showedPrompt,
        }: {
          acceptedNotifications: boolean;
          showedPrompt: boolean;
        }) => void,
      ) => {
        callback({ acceptedNotifications: false, showedPrompt: false });
        return { type: 'check notifications' };
      },
    );

    const { getByTestId } = renderWithContext(
      <ReminderButton {...props} reminder={reminder}>
        <View />
      </ReminderButton>,
      { initialState: {} },
    );

    fireEvent(getByTestId('ReminderDatePicker'), 'onPressIOS', {
      showPicker,
    });

    expect(checkNotifications).toHaveBeenCalledWith(
      NOTIFICATION_PROMPT_TYPES.SET_REMINDER,
      expect.any(Function),
    );
    expect(navigateBack).not.toHaveBeenCalled();
    expect(showPicker).not.toHaveBeenCalled();
  });

  it('declines notifications, navigates back from prompt screen, and does not show picker', () => {
    (checkNotifications as jest.Mock).mockImplementation(
      (
        _,
        callback: ({
          acceptedNotifications,
          showedPrompt,
        }: {
          acceptedNotifications: boolean;
          showedPrompt: boolean;
        }) => void,
      ) => {
        callback({ acceptedNotifications: false, showedPrompt: true });
        return { type: 'check notifications' };
      },
    );

    const { getByTestId } = renderWithContext(
      <ReminderButton {...props} reminder={reminder}>
        <View />
      </ReminderButton>,
      { initialState: {} },
    );

    fireEvent(getByTestId('ReminderDatePicker'), 'onPressIOS', {
      showPicker,
    });

    expect(checkNotifications).toHaveBeenCalledWith(
      NOTIFICATION_PROMPT_TYPES.SET_REMINDER,
      expect.any(Function),
    );
    expect(navigateBack).toHaveBeenCalledWith();
    expect(showPicker).not.toHaveBeenCalled();
  });
});

describe('onDateChange', () => {
  const reminder2 = {
    ...reminder,
    reminder_type: REMINDER_RECURRENCES_ENUM.WEEKLY,
  };
  it('creates step reminder', () => {
    const { getByTestId } = renderWithContext(
      <ReminderButton {...props} reminder={reminder2}>
        <View />
      </ReminderButton>,
      { initialState: {} },
    );
    const date = new Date('10/06/2019');
    fireEvent(getByTestId('ReminderDatePicker'), 'onDateChange', date);
    expect(createStepReminder).toHaveBeenCalledWith(
      stepId,
      date,
      reminder2.reminder_type,
    );
  });
});
