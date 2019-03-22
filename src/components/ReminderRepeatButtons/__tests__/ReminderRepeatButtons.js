import React from 'react';

import ReminderRepeatButtons from '..';

import { renderShallow } from '../../../../testUtils';
import { REMINDER_RECURRENCES } from '../../../constants';

const { ONCE, DAILY, WEEKLY, MONTHLY } = REMINDER_RECURRENCES;

let component;
let instance;

const test = () => expect(component).toMatchSnapshot();

beforeEach(() => {
  component = renderShallow(
    <ReminderRepeatButtons onRecurrenceChange={jest.fn()} />,
  );
  instance = component.instance();
});

describe('none selected', () => {
  it('renders with none highlighted', () => {
    test();
  });

  it('updates state', () => {
    expect(instance.state).toEqual({
      recurrence: ONCE,
    });
  });
});

describe('select daily button', () => {
  beforeEach(() => {
    component
      .childAt(0)
      .props()
      .onPress();
    component.update();
  });

  it('renders with daily button highlighted only', () => {
    test();
  });

  it('updates state', () => {
    expect(instance.state).toEqual({
      recurrence: DAILY,
    });
  });

  describe('select button again', () => {
    beforeEach(() => {
      component
        .childAt(0)
        .props()
        .onPress();
      component.update();
    });

    it('renders with none highlighted', () => {
      test();
    });

    it('updates state', () => {
      expect(instance.state).toEqual({
        recurrence: ONCE,
      });
    });
  });

  describe('select other button', () => {
    beforeEach(() => {
      component
        .childAt(1)
        .props()
        .onPress();
      component.update();
    });

    it('renders with other highlighted only', () => {
      test();
    });

    it('updates state', () => {
      expect(instance.state).toEqual({
        recurrence: WEEKLY,
      });
    });
  });
});

describe('select weekly button', () => {
  beforeEach(() => {
    component
      .childAt(1)
      .props()
      .onPress();
    component.update();
  });

  it('renders with weekly button highlighted only', () => {
    test();
  });

  it('updates state', () => {
    expect(instance.state).toEqual({
      recurrence: WEEKLY,
    });
  });
});

describe('select monthly button', () => {
  beforeEach(() => {
    component
      .childAt(2)
      .props()
      .onPress();
    component.update();
  });

  it('renders with monthly button highlighted only', () => {
    test();
  });

  it('updates state', () => {
    expect(instance.state).toEqual({
      recurrence: MONTHLY,
    });
  });
});
