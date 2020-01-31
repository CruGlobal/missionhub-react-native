import React from 'react';
import MockDate from 'mockdate';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { renderShallow, createMockNavState } from '../../../../testUtils';
import { navigateBack } from '../../../actions/navigation';
import { createStepReminder } from '../../../actions/stepReminders';
import { reminderSelector } from '../../../selectors/stepReminders';
import { ReminderTypeEnum } from '../../../../__generated__/globalTypes';

import SetReminderScreen from '..';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/stepReminders');
jest.mock('../../../selectors/stepReminders');

const mockDate = '2018-09-01';
MockDate.set(mockDate);

const mockStore = configureStore([thunk]);
const stepId = '42234';
const reminderId = '1';
const reminder = {
  id: reminderId,
  reminder_type: ReminderTypeEnum.once,
  next_occurrence_at: mockDate,
};
const stepReminders = {
  all: {
    [reminderId]: reminder,
  },
};

// @ts-ignore
let component;
// @ts-ignore
let instance;
// @ts-ignore
let store;

const navigateBackResult = { type: 'navigated back' };
const createStepReminderResult = { type: 'created step reminder' };

// @ts-ignore
navigateBack.mockReturnValue(navigateBackResult);
// @ts-ignore
createStepReminder.mockReturnValue(createStepReminderResult);

const createComponent = () => {
  store = mockStore({ stepReminders });

  component = renderShallow(
    // @ts-ignore
    <SetReminderScreen navigation={createMockNavState({ stepId })} />,
    store,
  );
  instance = component.instance();
};

describe('render', () => {
  describe('reminder in props', () => {
    beforeEach(() => {
      // @ts-ignore
      reminderSelector.mockReturnValue(reminder);
      createComponent();
    });

    it('renders correctly', () => {
      // @ts-ignore
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
      // @ts-ignore
      reminderSelector.mockReturnValue(null);
      createComponent();
    });

    it('renders correctly', () => {
      // @ts-ignore
      expect(component).toMatchSnapshot();
    });
  });
});

describe('handleChangeDate', () => {
  beforeEach(() => {
    // @ts-ignore
    reminderSelector.mockReturnValue(null);
    createComponent();
  });

  describe('date passed in', () => {
    beforeEach(() => {
      // @ts-ignore
      component
        .childAt(1)
        .childAt(0)
        .childAt(1)
        .props()
        .onDateChange(mockDate);

      // @ts-ignore
      component.update();
    });

    it('sets new state', () => {
      // @ts-ignore
      expect(instance.state).toEqual({
        date: mockDate,
        disableBtn: false,
        recurrence: null,
      });
    });

    it('renders correctly', () => {
      // @ts-ignore
      expect(component).toMatchSnapshot();
    });
  });

  describe('date not passed in', () => {
    beforeEach(() => {
      // @ts-ignore
      component
        .childAt(1)
        .childAt(0)
        .childAt(1)
        .props()
        .onDateChange(null);

      // @ts-ignore
      component.update();
    });

    it('sets new state', () => {
      // @ts-ignore
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
    // @ts-ignore
    reminderSelector.mockReturnValue(null);
    createComponent();

    // @ts-ignore
    component
      .childAt(1)
      .childAt(1)
      .props()
      .onRecurrenceChange(ReminderTypeEnum.once);

    // @ts-ignore
    component.update();
  });

  it('sets new state', () => {
    // @ts-ignore
    expect(instance.state).toEqual({
      date: '',
      disableBtn: true,
      recurrence: ReminderTypeEnum.once,
    });
  });

  it('renders correctly', () => {
    // @ts-ignore
    expect(component).toMatchSnapshot();
  });
});

describe('handleSetReminder', () => {
  const recurrence = 'ROBERT';

  beforeEach(() => {
    // @ts-ignore
    component
      .childAt(1)
      .childAt(0)
      .childAt(1)
      .props()
      .onDateChange(mockDate);
    // @ts-ignore
    component
      .childAt(1)
      .childAt(1)
      .props()
      .onRecurrenceChange(recurrence);
    // @ts-ignore
    component
      .childAt(2)
      .props()
      .onPress();

    // @ts-ignore
    component.update();
  });

  it('navigates back and creates step', () => {
    expect(navigateBack).toHaveBeenCalled();
    expect(createStepReminder).toHaveBeenCalledWith(
      stepId,
      mockDate,
      recurrence,
    );
    // @ts-ignore
    expect(store.getActions()).toEqual([
      navigateBackResult,
      createStepReminderResult,
    ]);
  });
});
