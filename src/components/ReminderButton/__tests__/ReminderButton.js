import React from 'react';

import { renderShallow, createMockStore } from '../../../../testUtils/index';
import { navigatePush } from '../../../actions/navigation';
import { removeStepReminder } from '../../../actions/stepReminders';
import { STEP_REMINDER_SCREEN } from '../../../containers/StepReminderScreen';

import ReminderButton from '..';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/stepReminders');

const step = { id: '1' };

const store = createMockStore();
let component;

beforeEach(() => {
  component = renderShallow(<ReminderButton step={step} />, store);
});

it('renders correctly', () => {
  expect(component).toMatchSnapshot();
});

describe('handlePressAndroid', () => {
  beforeEach(() => {
    component.props().onPressAndroid();
  });

  it('navigates to step reminder screen', () => {
    expect(navigatePush).toHaveBeenCalledWith(STEP_REMINDER_SCREEN, { step });
  });
});

describe('handleRemoveReminder', () => {
  beforeEach(() => {
    component
      .childAt(0)
      .childAt(1)
      .props()
      .onPress();
  });

  it('removes reminder', () => {
    expect(removeStepReminder).toHaveBeenCalledWith(step.id);
  });
});
