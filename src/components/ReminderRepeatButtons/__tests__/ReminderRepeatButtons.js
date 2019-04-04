import React from 'react';

import ReminderRepeatButtons from '..';

import { renderShallow } from '../../../../testUtils';
import { REMINDER_RECURRENCES } from '../../../constants';

const { ONCE, DAILY, WEEKLY, MONTHLY } = REMINDER_RECURRENCES;

const onRecurrenceChange = jest.fn();

let component;

const test = () => expect(component).toMatchSnapshot();

beforeEach(() => {
  onRecurrenceChange.mockClear();
  component = renderShallow(
    <ReminderRepeatButtons onRecurrenceChange={onRecurrenceChange} />,
  );
});

describe('none selected', () => {
  it('renders with none highlighted', () => {
    test();
  });

  it('calls onRecurrenceChange with ONCE', () => {
    expect(onRecurrenceChange).toHaveBeenCalledTimes(1);
    expect(onRecurrenceChange).toHaveBeenCalledWith(ONCE);
  });
});

describe('starts with weekly selected', () => {
  beforeEach(() => {
    onRecurrenceChange.mockClear();
    component = renderShallow(
      <ReminderRepeatButtons
        recurrence={WEEKLY}
        onRecurrenceChange={onRecurrenceChange}
      />,
    );
  });

  it('renders with weekly highlighted', () => {
    test();
  });

  it('calls onRecurrenceChange with ONCE', () => {
    expect(onRecurrenceChange).toHaveBeenCalledTimes(1);
    expect(onRecurrenceChange).toHaveBeenCalledWith(WEEKLY);
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

  it('calls onRecurrenceChange with DAILY', () => {
    expect(onRecurrenceChange).toHaveBeenCalledTimes(2);
    expect(onRecurrenceChange).toHaveBeenCalledWith(DAILY);
  });

  describe('select button again', () => {
    beforeEach(() => {
      component
        .childAt(0)
        .props()
        .onPress();
      component.update();
    });

    it('calls onRecurrenceChange with ONCE', () => {
      expect(onRecurrenceChange).toHaveBeenCalledTimes(3);
      expect(onRecurrenceChange).toHaveBeenCalledWith(ONCE);
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

    it('calls onRecurrenceChange with WEEKLY', () => {
      expect(onRecurrenceChange).toHaveBeenCalledTimes(3);
      expect(onRecurrenceChange).toHaveBeenCalledWith(WEEKLY);
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

  it('calls onRecurrenceChange with WEEKLY', () => {
    expect(onRecurrenceChange).toHaveBeenCalledTimes(2);
    expect(onRecurrenceChange).toHaveBeenCalledWith(WEEKLY);
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

  it('calls onRecurrenceChange with MONTHLY', () => {
    expect(onRecurrenceChange).toHaveBeenCalledTimes(2);
    expect(onRecurrenceChange).toHaveBeenCalledWith(MONTHLY);
  });
});
