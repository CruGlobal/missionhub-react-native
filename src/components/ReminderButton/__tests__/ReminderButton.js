import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { renderShallow } from '../../../../testUtils/index';
import { navigatePush } from '../../../actions/navigation';
import { STEP_REMINDER_SCREEN } from '../../../containers/StepReminderScreen';
import { createStepReminder } from '../../../actions/stepReminders';

import ReminderButton from '..';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/stepReminders');

const stepId = '1';
const navigatePushResult = { type: 'navigated push' };
const createStepReminderResult = { type: 'create step reminder' };

const mockStore = configureStore([thunk]);
let store;
let component;

navigatePush.mockReturnValue(navigatePushResult);
createStepReminder.mockReturnValue(createStepReminderResult);

beforeEach(() => {
  store = mockStore();
  component = renderShallow(<ReminderButton stepId={stepId} />, store);
});

it('renders correctly', () => {
  expect(component).toMatchSnapshot();
});

describe('handlePressAndroid', () => {
  beforeEach(() => {
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
    component.props().iOSModalContent.props.onRecurrenceChange(recurrence);
    component.props().onDateChange(date);
  });

  it('creates step reminder', () => {
    expect(createStepReminder).toHaveBeenCalledWith(stepId, date, recurrence);
    expect(store.getActions()).toEqual([createStepReminderResult]);
  });
});
