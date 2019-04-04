import React from 'react';
import MockDate from 'mockdate';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import SetReminderScreen from '..';

import { renderShallow, createMockNavState } from '../../../../testUtils';
import { navigateBack } from '../../../actions/navigation';
import { createStepReminder } from '../../../actions/stepReminders';
import { reminderSelector } from '../../../selectors/stepReminders';
import { REMINDER_RECURRENCES } from '../../../constants';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/stepReminders');
jest.mock('../../../selectors/stepReminders');

const { ONCE } = REMINDER_RECURRENCES;

const mockDate = '2018-09-01';
MockDate.set(mockDate);

const mockStore = configureStore([thunk]);
const stepId = '42234';
const reminderId = '1';
const reminder = {
  id: reminderId,
  reminder_type: ONCE,
  next_occurrence_at: mockDate,
};
const stepReminders = {
  all: {
    [reminderId]: reminder,
  },
};

let component;
let instance;
let store;

const navigateBackResult = { type: 'navigated back' };
const createStepReminderResult = { type: 'created step reminder' };

navigateBack.mockReturnValue(navigateBackResult);
createStepReminder.mockReturnValue(createStepReminderResult);

const createComponent = () => {
  store = mockStore({ stepReminders });

  component = renderShallow(
    <SetReminderScreen navigation={createMockNavState({ stepId })} />,
    store,
  );
  instance = component.instance();
};

describe('render', () => {
  describe('reminder in props', () => {
    beforeEach(() => {
      reminderSelector.mockReturnValue(reminder);
      createComponent();
    });

    it('renders correctly', () => {
      expect(component).toMatchSnapshot();
    });

    it('selects reminder from Redux', () => {
      expect(reminderSelector).toHaveBeenCalledWith(
        { stepReminders },
        { stepId },
      );
    });
  });

  describe('no reminder in props', () => {
    beforeEach(() => {
      reminderSelector.mockReturnValue(null);
      createComponent();
    });

    it('renders correctly', () => {
      expect(component).toMatchSnapshot();
    });
  });
});

describe('handleChangeDate', () => {
  beforeEach(() => {
    reminderSelector.mockReturnValue(null);
    createComponent();
  });

  describe('date passed in', () => {
    beforeEach(() => {
      component
        .childAt(1)
        .childAt(0)
        .childAt(1)
        .props()
        .onDateChange(mockDate);

      component.update();
    });

    it('sets new state', () => {
      expect(instance.state).toEqual({
        date: mockDate,
        disableBtn: false,
        recurrence: null,
      });
    });

    it('renders correctly', () => {
      expect(component).toMatchSnapshot();
    });
  });

  describe('date not passed in', () => {
    beforeEach(() => {
      component
        .childAt(1)
        .childAt(0)
        .childAt(1)
        .props()
        .onDateChange(null);

      component.update();
    });

    it('sets new state', () => {
      expect(instance.state).toEqual({
        date: '',
        disableBtn: true,
        recurrence: null,
      });
    });
  });
});

describe('handleRecurrenceChange', () => {
  beforeEach(() => {
    reminderSelector.mockReturnValue(null);
    createComponent();

    component
      .childAt(1)
      .childAt(1)
      .props()
      .onRecurrenceChange(ONCE);

    component.update();
  });

  it('sets new state', () => {
    expect(instance.state).toEqual({
      date: '',
      disableBtn: true,
      recurrence: ONCE,
    });
  });

  it('renders correctly', () => {
    expect(component).toMatchSnapshot();
  });
});

describe('handleSetReminder', () => {
  const recurrence = 'ROBERT';

  beforeEach(() => {
    component
      .childAt(1)
      .childAt(0)
      .childAt(1)
      .props()
      .onDateChange(mockDate);
    component
      .childAt(1)
      .childAt(1)
      .props()
      .onRecurrenceChange(recurrence);
    component
      .childAt(2)
      .props()
      .onPress();

    component.update();
  });

  it('navigates back and creates step', () => {
    expect(navigateBack).toHaveBeenCalled();
    expect(createStepReminder).toHaveBeenCalledWith(
      stepId,
      mockDate,
      recurrence,
    );
    expect(store.getActions()).toEqual([
      navigateBackResult,
      createStepReminderResult,
    ]);
  });
});
