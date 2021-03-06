import React from 'react';
import MockDate from 'mockdate';
import { View } from 'react-native';
import { fireEvent } from 'react-native-testing-library';
import faker from 'faker/locale/en';

import { NOTIFICATION_PROMPT_TYPES } from '../../../constants';
import { renderWithContext } from '../../../../testUtils';
import {
  requestNativePermissions,
  checkNotifications,
} from '../../../actions/notifications';
import { navigatePush, navigateBack } from '../../../actions/navigation';
import { STEP_REMINDER_SCREEN } from '../../../containers/StepReminderScreen';
import { createStepReminder } from '../../../actions/stepReminders';
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { ReminderButton as Reminder } from '../__generated__/ReminderButton';
import { ReminderTypeEnum } from '../../../../__generated__/globalTypes';
import { REMINDER_BUTTON_FRAGMENT } from '../queries';
import ReminderButton from '..';
import * as common from '../../../utils/common';

jest.mock('../../../actions/notifications');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/stepReminders');

const stepId = '1';
const reminder = mockFragment<Reminder>(REMINDER_BUTTON_FRAGMENT);

MockDate.set(faker.date.past(1, '2019-01-01'));

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
      <ReminderButton {...props} reminder={null}>
        <View />
      </ReminderButton>,
      { initialState: {} },
    ).snapshot();
  });
});

describe('handlePressAndroid', () => {
  it('requests notifications and navigates to step reminder screen', () => {
    ((common as unknown) as { isAndroid: boolean }).isAndroid = true;
    (checkNotifications as jest.Mock).mockImplementation(
      (
        _,
        callback: ({
          nativePermissionsEnabled,
          showedPrompt,
        }: {
          nativePermissionsEnabled: boolean;
          showedPrompt: boolean;
        }) => void,
      ) => {
        callback({ nativePermissionsEnabled: true, showedPrompt: false });
        return { type: 'check notifications' };
      },
    );
    const { getByTestId } = renderWithContext(
      <ReminderButton {...props} reminder={reminder}>
        <View />
      </ReminderButton>,
      { initialState: {} },
    );
    fireEvent(getByTestId('ReminderDatePicker'), 'onPress', {
      showPicker: jest.fn(),
    });

    expect(checkNotifications).toHaveBeenCalledWith(
      NOTIFICATION_PROMPT_TYPES.SET_REMINDER,
      expect.any(Function),
    );
    expect(navigatePush).toHaveBeenCalledWith(STEP_REMINDER_SCREEN, {
      reminder,
      stepId,
    });
  });
});

describe('handlePressIOS', () => {
  const showPicker = jest.fn();

  beforeEach(() => {
    ((common as unknown) as {
      isAndroid: boolean;
    }).isAndroid = false;
  });

  it('requests notifications and shows picker', () => {
    (checkNotifications as jest.Mock).mockImplementation(
      (
        _,
        callback: ({
          nativePermissionsEnabled,
          showedPrompt,
        }: {
          nativePermissionsEnabled: boolean;
          showedPrompt: boolean;
        }) => void,
      ) => {
        callback({ nativePermissionsEnabled: true, showedPrompt: false });
        return { type: 'check notifications' };
      },
    );

    const { getByTestId } = renderWithContext(
      <ReminderButton {...props} reminder={reminder}>
        <View />
      </ReminderButton>,
      { initialState: {} },
    );

    fireEvent(getByTestId('ReminderDatePicker'), 'onPress', {
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
          nativePermissionsEnabled,
          showedPrompt,
        }: {
          nativePermissionsEnabled: boolean;
          showedPrompt: boolean;
        }) => void,
      ) => {
        callback({ nativePermissionsEnabled: true, showedPrompt: true });
        return { type: 'check notifications' };
      },
    );

    const { getByTestId } = renderWithContext(
      <ReminderButton {...props} reminder={reminder}>
        <View />
      </ReminderButton>,
      { initialState: {} },
    );

    fireEvent(getByTestId('ReminderDatePicker'), 'onPress', {
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
          nativePermissionsEnabled,
          showedPrompt,
        }: {
          nativePermissionsEnabled: boolean;
          showedPrompt: boolean;
        }) => void,
      ) => {
        callback({ nativePermissionsEnabled: false, showedPrompt: false });
        return { type: 'check notifications' };
      },
    );

    const { getByTestId } = renderWithContext(
      <ReminderButton {...props} reminder={reminder}>
        <View />
      </ReminderButton>,
      { initialState: {} },
    );

    fireEvent(getByTestId('ReminderDatePicker'), 'onPress', {
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
          nativePermissionsEnabled,
          showedPrompt,
        }: {
          nativePermissionsEnabled: boolean;
          showedPrompt: boolean;
        }) => void,
      ) => {
        callback({ nativePermissionsEnabled: false, showedPrompt: true });
        return { type: 'check notifications' };
      },
    );

    const { getByTestId } = renderWithContext(
      <ReminderButton {...props} reminder={reminder}>
        <View />
      </ReminderButton>,
      { initialState: {} },
    );

    fireEvent(getByTestId('ReminderDatePicker'), 'onPress', {
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
  const reminder2: Reminder = {
    ...reminder,
    reminderType: ReminderTypeEnum.weekly,
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
      reminder2.reminderType,
    );
  });
});
