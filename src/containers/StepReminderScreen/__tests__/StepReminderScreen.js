import React from 'react';
import MockDate from 'mockdate';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import SetReminderScreen from '..';

import { renderShallow, createMockNavState } from '../../../../testUtils';
import { navigateBack } from '../../../actions/navigation';
import { createStepReminder } from '../../../actions/stepReminders';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/stepReminders');

const mockDate = '2018-09-01';
MockDate.set(mockDate);

const mockStore = configureStore([thunk]);
const stepId = '42234';
let date = '';
let component;
let instance;
let store;

const navigateBackResult = { type: 'navigated back' };
const createStepReminderResult = { type: 'created step reminder' };

navigateBack.mockReturnValue(navigateBackResult);
createStepReminder.mockReturnValue(createStepReminderResult);

const createComponent = () => {
  store = mockStore();

  component = renderShallow(
    <SetReminderScreen
      date={date}
      navigation={createMockNavState({ stepId })}
    />,
    store,
  );
  instance = component.instance();
};

describe('render', () => {
  describe('date in props', () => {
    beforeEach(() => {
      date = mockDate;
      createComponent();
    });

    it('renders correctly', () => {
      expect(component).toMatchSnapshot();
    });
  });

  describe('no date in props', () => {
    beforeEach(() => {
      date = null;
      createComponent();
    });

    it('renders correctly', () => {
      expect(component).toMatchSnapshot();
    });
  });
});

describe('handleChangeDate', () => {
  beforeEach(() => {
    date = null;
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
