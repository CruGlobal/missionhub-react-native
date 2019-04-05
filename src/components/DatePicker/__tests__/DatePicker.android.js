/* eslint max-lines-per-function: 0 */
import React from 'react';
import { TimePickerAndroid, DatePickerAndroid, Text } from 'react-native';
import MockDate from 'mockdate';
import moment from 'moment';

import {
  testSnapshotShallow,
  renderShallow,
} from '../../../../testUtils/index';
import DatePicker from '../index.android.js';

TimePickerAndroid.open = jest.fn();
DatePickerAndroid.open = jest.fn();

const mockDate = '2018-09-12 12:00:00 PM GMT+0';
MockDate.set(mockDate);
const today = new Date();

it('renders date picker touchable', () => {
  testSnapshotShallow(<DatePicker date={today} />);
});

it('renders with child component', () => {
  testSnapshotShallow(
    <DatePicker date={today}>
      <Text>Child Component</Text>
    </DatePicker>,
  );
});

describe('DatePicker methods', () => {
  let component;
  let instance;
  let action;
  const date = new Date();
  const minDate = new Date();
  const maxDate = new Date();
  const today = moment(date);
  const mockChange = jest.fn();
  const mockCloseModal = jest.fn();
  const androidMode = 'default';

  describe('mode is date', () => {
    beforeEach(() => {
      component = renderShallow(
        <DatePicker
          date={date}
          minDate={minDate}
          maxDate={maxDate}
          onDateChange={mockChange}
          onCloseModal={mockCloseModal}
          androidMode={androidMode}
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
        DatePickerAndroid.open.mockReturnValue(action);

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
          mode: androidMode,
        });
        expect(instance.state.date).toEqual(
          new Date(
            action.year,
            action.month,
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
        DatePickerAndroid.open.mockReturnValue(action);

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
          mode: androidMode,
        });
        expect(mockCloseModal).toHaveBeenCalled();
      });
    });
  });

  describe('mode is time', () => {
    beforeEach(() => {
      component = renderShallow(
        <DatePicker
          date={date}
          onDateChange={mockChange}
          onCloseModal={mockCloseModal}
          androidMode={androidMode}
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
        TimePickerAndroid.open.mockReturnValue(action);

        await component
          .childAt(0)
          .props()
          .onPress();
      });

      it('picks date', () => {
        expect(TimePickerAndroid.open).toHaveBeenCalledWith({
          hour: moment(date).hour(),
          minute: moment(date).minutes(),
          is24Hour: true,
          mode: androidMode,
        });
        expect(instance.state.date).toEqual(
          new Date(
            today.year(),
            today.month(),
            today.date(),
            action.hour,
            action.minute,
          ),
        );
        expect(mockChange).toHaveBeenCalled();
      });
    });
  });

  describe('mode is datetime', () => {
    let dateAction;
    let timeAction;

    beforeEach(() => {
      component = renderShallow(
        <DatePicker
          date={date}
          minDate={minDate}
          maxDate={maxDate}
          onDateChange={mockChange}
          onCloseModal={mockCloseModal}
          androidMode={androidMode}
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
        DatePickerAndroid.open.mockReturnValue(dateAction);
        timeAction = {
          action: 'test',
          hour: '1',
          minute: '30',
        };
        TimePickerAndroid.open.mockReturnValue(timeAction);

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
          mode: androidMode,
        });
        expect(TimePickerAndroid.open).toHaveBeenCalledWith({
          hour: moment(date).hour(),
          minute: moment(date).minutes(),
          is24Hour: true,
          mode: androidMode,
        });
        expect(instance.state.date).toEqual(
          new Date(
            dateAction.year,
            dateAction.month,
            dateAction.day,
            timeAction.hour,
            timeAction.minute,
          ),
        );
        expect(mockChange).toHaveBeenCalled();
      });
    });
  });
});
