import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockDate from 'mockdate';

import { NOTIFICATION_PROMPT_TYPES } from '../../../constants';
import { renderShallow } from '../../../../testUtils/index';
import {
  requestNativePermissions,
  showNotificationPrompt,
} from '../../../actions/notifications';
import { navigatePush } from '../../../actions/navigation';
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
const createStepReminderResult = { type: 'create step reminder' };

const mockStore = configureStore([thunk]);
let store;
let component;
let instance;

const createComponent = props => {
  store = mockStore();
  component = renderShallow(<ReminderButton {...props} />, store);
  instance = component.instance();
};

beforeEach(() => {
  requestNativePermissions.mockReturnValue(requestNotificationsResult);
  navigatePush.mockReturnValue(navigatePushResult);
  createStepReminder.mockReturnValue(createStepReminderResult);
});

describe('reminder passed in', () => {
  beforeEach(() => {
    createComponent({ stepId, reminder });
  });

  it('renders correctly', () => {
    expect(component).toMatchSnapshot();
  });
});

describe('reminder not passed in', () => {
  beforeEach(() => {
    createComponent({ stepId });
  });

  it('renders correctly', () => {
    expect(component).toMatchSnapshot();
  });
});

describe('handlePressAndroid', () => {
  beforeEach(() => {
    createComponent({ stepId, reminder });
    component.props().onPressAndroid();
  });

  it('requests notifications and navigates to step reminder screen', () => {
    expect(requestNativePermissions).toHaveBeenCalled();
    expect(navigatePush).toHaveBeenCalledWith(STEP_REMINDER_SCREEN, { stepId });
  });
});

describe('handlePressIOS', () => {
  const showPromptResult = {
    type: 'showed notification prompt',
  };
  let showPicker;

  beforeEach(() => {
    createComponent({ stepId, reminder });
    showPicker = jest.fn();
  });

  describe('user accepts notifications', () => {
    beforeEach(async () => {
      showNotificationPrompt.mockReturnValue({
        ...showPromptResult,
        acceptedNotifications: true,
      });
      await component.props().onPressIOS({ showPicker });
    });

    it('shows notification prompt and then shows date picker', () => {
      expect(showNotificationPrompt).toHaveBeenCalledWith(
        NOTIFICATION_PROMPT_TYPES.SET_REMINDER,
      );
      expect(showPicker).toHaveBeenCalled();
    });
  });

  describe('user denies notifications', () => {
    beforeEach(async () => {
      showNotificationPrompt.mockReturnValue({
        ...showPromptResult,
        acceptedNotifications: false,
      });
      await component.props().onPressIOS({ showPicker });
    });

    it('shows notification prompt and does not show date picker', () => {
      expect(showNotificationPrompt).toHaveBeenCalledWith(
        NOTIFICATION_PROMPT_TYPES.SET_REMINDER,
      );
      expect(showPicker).not.toHaveBeenCalled();
    });
  });
});

describe('onRecurrenceChange', () => {
  const recurrence = 'weekLEE';

  beforeEach(() => {
    createComponent({ stepId, reminder });
    component.props().iOSModalContent.props.onRecurrenceChange(recurrence);
  });

  it('creates step reminder', () => {
    expect(instance.state).toEqual({ date: mockDate, recurrence });
  });
});

describe('onDateChange', () => {
  const date = new Date();
  const recurrence = 'weekLEE';

  beforeEach(() => {
    createComponent({ stepId, reminder });
    component.props().iOSModalContent.props.onRecurrenceChange(recurrence);
    component.props().onDateChange(date);
  });

  it('creates step reminder', () => {
    expect(instance.state).toEqual({ date, recurrence });
    expect(createStepReminder).toHaveBeenCalledWith(stepId, date, recurrence);
    expect(store.getActions()).toEqual([createStepReminderResult]);
  });
});
