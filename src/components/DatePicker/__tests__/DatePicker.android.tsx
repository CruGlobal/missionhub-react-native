import React from 'react';
import { TimePickerAndroid, DatePickerAndroid, Text } from 'react-native';
import MockDate from 'mockdate';
import moment from 'moment';

import { testSnapshotShallow, renderShallow } from '../../../../testUtils';
import DatePicker from '../index.android';

TimePickerAndroid.open = jest.fn();
DatePickerAndroid.open = jest.fn();

const mockDate = '2018-09-12 12:00:00 PM GMT+0';
MockDate.set(mockDate);
const today = new Date();

it('renders date picker touchable', () => {
  // @ts-ignore
  testSnapshotShallow(<DatePicker date={today} />);
});

it('renders with child component', () => {
  testSnapshotShallow(
    // @ts-ignore
    <DatePicker date={today}>
      <Text>Child Component</Text>
    </DatePicker>,
  );
});

describe('DatePicker methods', () => {
  // @ts-ignore
  let component;
  // @ts-ignore
  let instance;
  // @ts-ignore
  let action;
  const date = new Date();
  const minDate = new Date();
  const maxDate = new Date();
  const today = moment(date);
  const mockChange = jest.fn();
  const mockCloseModal = jest.fn();
  const androidDateMode = 'default';
  const androidTimeMode = 'spinner';

  describe('mode is date', () => {
    beforeEach(() => {
      component = renderShallow(
        <DatePicker
          // @ts-ignore
          date={date}
          minDate={minDate}
          maxDate={maxDate}
          onDateChange={mockChange}
          onCloseModal={mockCloseModal}
          androidDateMode={androidDateMode}
          mode="date"
        />,
      );

      instance = component.instance();
    });

    describe('loads DatePickerAndroid and picks date', () => {
      beforeEach(async () => {
        action = {
          action: 'test',
          year: '2018',
          month: '08',
          day: '13',
        };
        // @ts-ignore
        DatePickerAndroid.open.mockReturnValue(action);

        // @ts-ignore
        await component
          .childAt(0)
          .props()
          .onPress();
      });

      it('picks date', () => {
        expect(DatePickerAndroid.open).toHaveBeenCalledWith({
          date,
          minDate,
          maxDate,
          mode: androidDateMode,
        });
        // @ts-ignore
        expect(instance.state.date).toEqual(
          new Date(
            // @ts-ignore
            action.year,
            // @ts-ignore
            action.month,
            // @ts-ignore
            action.day,
            today.hour(),
            today.minutes(),
          ),
        );
        expect(mockChange).toHaveBeenCalled();
      });
    });

    describe('loads DatePickerAndroid and cancels', () => {
      beforeEach(async () => {
        action = {
          action: DatePickerAndroid.dismissedAction,
        };
        // @ts-ignore
        DatePickerAndroid.open.mockReturnValue(action);

        // @ts-ignore
        await component
          .childAt(0)
          .props()
          .onPress();
      });

      it('cancels', () => {
        expect(DatePickerAndroid.open).toHaveBeenCalledWith({
          date,
          minDate,
          maxDate,
          mode: androidDateMode,
        });
        expect(mockCloseModal).toHaveBeenCalled();
      });
    });
  });

  describe('mode is time', () => {
    beforeEach(() => {
      component = renderShallow(
        <DatePicker
          // @ts-ignore
          date={date}
          onDateChange={mockChange}
          onCloseModal={mockCloseModal}
          androidTimeMode={androidTimeMode}
          mode="time"
        />,
      );

      instance = component.instance();
    });

    describe('loads TimePickerAndroid and picks time', () => {
      beforeEach(async () => {
        action = {
          action: 'test',
          hour: '1',
          minute: '30',
        };
        // @ts-ignore
        TimePickerAndroid.open.mockReturnValue(action);

        // @ts-ignore
        await component
          .childAt(0)
          .props()
          .onPress();
      });

      it('picks time', () => {
        expect(TimePickerAndroid.open).toHaveBeenCalledWith({
          hour: moment(date).hour(),
          minute: moment(date).minutes(),
          is24Hour: false,
          mode: androidTimeMode,
        });
        // @ts-ignore
        expect(instance.state.date).toEqual(
          new Date(
            today.year(),
            today.month(),
            today.date(),
            // @ts-ignore
            action.hour,
            // @ts-ignore
            action.minute,
          ),
        );
        expect(mockChange).toHaveBeenCalled();
      });
    });
  });

  describe('mode is datetime', () => {
    // @ts-ignore
    let dateAction;
    // @ts-ignore
    let timeAction;

    beforeEach(() => {
      component = renderShallow(
        <DatePicker
          // @ts-ignore
          date={date}
          minDate={minDate}
          maxDate={maxDate}
          onDateChange={mockChange}
          onCloseModal={mockCloseModal}
          androidDateMode={androidDateMode}
          androidTimeMode={androidTimeMode}
          mode="datetime"
        />,
      );

      instance = component.instance();
    });

    describe('loads DatePickerAndroid and TimePickerAndroid', () => {
      beforeEach(async () => {
        dateAction = {
          action: 'test',
          year: '2018',
          month: '08',
          day: '13',
        };
        // @ts-ignore
        DatePickerAndroid.open.mockReturnValue(dateAction);
        timeAction = {
          action: 'test',
          hour: '1',
          minute: '30',
        };
        // @ts-ignore
        TimePickerAndroid.open.mockReturnValue(timeAction);

        // @ts-ignore
        await component
          .childAt(0)
          .props()
          .onPress();
      });

      it('picks date and time', () => {
        expect(DatePickerAndroid.open).toHaveBeenCalledWith({
          date,
          minDate,
          maxDate,
          mode: androidDateMode,
        });
        expect(TimePickerAndroid.open).toHaveBeenCalledWith({
          hour: moment(date).hour(),
          minute: moment(date).minutes(),
          is24Hour: false,
          mode: androidTimeMode,
        });
        // @ts-ignore
        expect(instance.state.date).toEqual(
          new Date(
            // @ts-ignore
            dateAction.year,
            // @ts-ignore
            dateAction.month,
            // @ts-ignore
            dateAction.day,
            // @ts-ignore
            timeAction.hour,
            // @ts-ignore
            timeAction.minute,
          ),
        );
        expect(mockChange).toHaveBeenCalled();
      });
    });
  });

  describe('custom action on press', () => {
    const onPressAndroid = jest.fn();

    beforeEach(async () => {
      component = renderShallow(
        <DatePicker
          // @ts-ignore
          date={date}
          onPressAndroid={onPressAndroid}
          onDateChange={mockChange}
          onCloseModal={mockCloseModal}
        />,
      );

      instance = component.instance();

      await component
        .childAt(0)
        .props()
        .onPress();
    });

    it('calls custom action and passes in showPicker', () => {
      expect(onPressAndroid).toHaveBeenCalledWith({
        // @ts-ignore
        showPicker: instance.showPicker,
      });
    });
  });
});
