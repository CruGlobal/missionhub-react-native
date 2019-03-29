import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockDate from 'mockdate';

import { renderShallow } from '../../../../testUtils/index';
import { navigatePush } from '../../../actions/navigation';
import { STEP_REMINDER_SCREEN } from '../../../containers/StepReminderScreen';
import { createStepReminder } from '../../../actions/stepReminders';

import ReminderButton from '..';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/stepReminders');

const stepId = '1';
const mockDate = '2018-09-12 12:00:00 PM GMT+0';
const reminder = { id: '11', next_occurrence_at: mockDate };

MockDate.set(mockDate);

const navigatePushResult = { type: 'navigated push' };
const createStepReminderResult = { type: 'create step reminder' };

const mockStore = configureStore([thunk]);
let store;
let component;

navigatePush.mockReturnValue(navigatePushResult);
createStepReminder.mockReturnValue(createStepReminderResult);

const createComponent = props => {
  store = mockStore();
  component = renderShallow(<ReminderButton {...props} />, store);
};

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

  it('navigates to step reminder screen', () => {
    expect(navigatePush).toHaveBeenCalledWith(STEP_REMINDER_SCREEN, { stepId });
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
    expect(createStepReminder).toHaveBeenCalledWith(stepId, date, recurrence);
    expect(store.getActions()).toEqual([createStepReminderResult]);
  });
});
