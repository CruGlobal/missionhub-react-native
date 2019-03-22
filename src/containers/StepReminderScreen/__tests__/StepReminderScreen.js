import React from 'react';
import MockDate from 'mockdate';

import SetReminderScreen from '..';

import {
  createMockStore,
  renderShallow,
  createMockNavState,
} from '../../../../testUtils';
import { navigateBack } from '../../../actions/navigation';

jest.mock('../../../actions/navigation');

const mockDate = '2018-09-01';
MockDate.set(mockDate);

const store = createMockStore();
const stepId = '42234';
let date = '';
let component;
let instance;

const createComponent = () => {
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
  beforeEach(() => {
    component
      .childAt(2)
      .props()
      .onPress();

    component.update();
  });

  it('navigates back', () => {
    expect(navigateBack).toHaveBeenCalled();
  });
});
