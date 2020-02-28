import React from 'react';

import { renderShallow } from '../../../../testUtils';
import { ReminderTypeEnum } from '../../../../__generated__/globalTypes';

import ReminderRepeatButtons from '..';

const onRecurrenceChange = jest.fn();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let component: any;

const test = () => expect(component).toMatchSnapshot();

describe('none selected', () => {
  beforeEach(() => {
    onRecurrenceChange.mockClear();
    component = renderShallow(
      <ReminderRepeatButtons onRecurrenceChange={onRecurrenceChange} />,
    );
  });

  it('renders with none highlighted', () => {
    test();
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
      expect(onRecurrenceChange).toHaveBeenCalledTimes(1);
      expect(onRecurrenceChange).toHaveBeenCalledWith(ReminderTypeEnum.daily);
    });
  });
});

describe('starts with weekly selected', () => {
  beforeEach(() => {
    onRecurrenceChange.mockClear();
    component = renderShallow(
      <ReminderRepeatButtons
        recurrence={ReminderTypeEnum.weekly}
        onRecurrenceChange={onRecurrenceChange}
      />,
    );
  });

  it('renders with weekly highlighted', () => {
    test();
  });

  describe('select weekly button', () => {
    beforeEach(() => {
      component
        .childAt(1)
        .props()
        .onPress();
      component.update();
    });

    it('calls onRecurrenceChange with ONCE', () => {
      expect(onRecurrenceChange).toHaveBeenCalledTimes(1);
      expect(onRecurrenceChange).toHaveBeenCalledWith(ReminderTypeEnum.once);
    });
  });

  describe('select other button', () => {
    beforeEach(() => {
      component
        .childAt(2)
        .props()
        .onPress();
      component.update();
    });

    it('calls onRecurrenceChange with MONTHLY', () => {
      expect(onRecurrenceChange).toHaveBeenCalledTimes(1);
      expect(onRecurrenceChange).toHaveBeenCalledWith(ReminderTypeEnum.monthly);
    });
  });
});

describe('starts with daily selected', () => {
  beforeEach(() => {
    onRecurrenceChange.mockClear();
    component = renderShallow(
      <ReminderRepeatButtons
        recurrence={ReminderTypeEnum.daily}
        onRecurrenceChange={onRecurrenceChange}
      />,
    );
  });

  it('renders with daily highlighted', () => {
    test();
  });
});

describe('starts with monthly selected', () => {
  beforeEach(() => {
    onRecurrenceChange.mockClear();
    component = renderShallow(
      <ReminderRepeatButtons
        recurrence={ReminderTypeEnum.monthly}
        onRecurrenceChange={onRecurrenceChange}
      />,
    );
  });

  it('renders with monthly highlighted', () => {
    test();
  });
});
