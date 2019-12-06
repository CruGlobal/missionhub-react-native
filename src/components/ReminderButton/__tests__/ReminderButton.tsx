import React from 'react';
import MockDate from 'mockdate';
import { View } from 'react-native';
import { fireEvent } from 'react-native-testing-library';
import faker from 'faker/locale/en';

import { NOTIFICATION_PROMPT_TYPES } from '../../../constants';
import { renderWithContext } from '../../../../testUtils';
import {
  requestNativePermissions,
  showNotificationPrompt,
} from '../../../actions/notifications';
import { navigatePush } from '../../../actions/navigation';
import { STEP_REMINDER_SCREEN } from '../../../containers/StepReminderScreen';
import { createStepReminder } from '../../../actions/stepReminders';
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { ReminderButton as Reminder } from '../__generated__/ReminderButton';
import { ReminderTypeEnum } from '../../../../__generated__/globalTypes';
import { REMINDER_BUTTON_FRAGMENT } from '../queries';

import ReminderButton from '..';

jest.mock('../../../actions/notifications');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/stepReminders');

const stepId = '1';
const reminder = mockFragment<Reminder>(REMINDER_BUTTON_FRAGMENT);

MockDate.set(faker.date.past(1, '2019-01-01'));

const requestNotificationsResult = { type: 'requested notifications' };
const navigatePushResult = { type: 'navigated push' };
const createStepReminderResult = { type: 'create step reminder' };

const props = { stepId, dispatch: jest.fn() };

beforeEach(() => {
  (requestNativePermissions as jest.Mock).mockReturnValue(
    requestNotificationsResult,
  );
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResult);
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
  beforeEach(() => {
    (showNotificationPrompt as jest.Mock).mockReturnValue({
      type: 'show notifcation prompt',
    });
  });
  it('requests notifications and navigates to step reminder screen', async () => {
    const { getByTestId } = renderWithContext(
      <ReminderButton {...props} reminder={reminder}>
        <View />
      </ReminderButton>,
      { initialState: {} },
    );
    await fireEvent(getByTestId('ReminderDatePicker'), 'onPressIOS', {
      showPicker,
    });
    expect(showNotificationPrompt).toHaveBeenCalledWith(
      NOTIFICATION_PROMPT_TYPES.SET_REMINDER,
    );
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
