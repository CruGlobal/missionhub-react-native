/* eslint max-lines: 0, max-lines-per-function: 0 */

import React from 'react';
import {
  Animated,
  TimePickerAndroid,
  DatePickerAndroid,
  Text,
} from 'react-native';
import MockDate from 'mockdate';
import moment from 'moment';

import {
  testSnapshotShallow,
  renderShallow,
} from '../../../../testUtils/index';
import * as common from '../../../utils/common';

import DatePicker from '..';

const mockDate = '2018-09-12 12:00:00 PM GMT+0';
MockDate.set(mockDate);

Animated.timing = jest.fn(() => ({
  start: jest.fn(a => a && a()),
}));

TimePickerAndroid.open = jest.fn();
DatePickerAndroid.open = jest.fn();

const today = new Date();

it('renders normal date picker', () => {
  testSnapshotShallow(<DatePicker date={today} />);
});

it('renders date only date picker', () => {
  testSnapshotShallow(<DatePicker date={today} mode="date" />);
});

it('renders datetime only date picker', () => {
  testSnapshotShallow(<DatePicker date={today} mode="datetime" />);
});

it('renders time only date picker', () => {
  testSnapshotShallow(<DatePicker date={today} mode="time" />);
});

it('renders date only date picker with min date', () => {
  testSnapshotShallow(
    <DatePicker date={today} mode="date" minDate={new Date()} />,
  );
});

it('renders date only date picker with max date', () => {
  testSnapshotShallow(
    <DatePicker date={today} mode="date" maxDate={new Date()} />,
  );
});

it('renders with child component', () => {
  testSnapshotShallow(
    <DatePicker date={today}>
      <Text>Child Component</Text>
    </DatePicker>,
  );
});

describe('date methods', () => {
  let component;
  let instance;
  const mockChange = jest.fn();
  const mockCloseModal = jest.fn();

  it('receive new date prop', () => {
    const date = new Date();
    component = renderShallow(
      <DatePicker date={date} onDateChange={mockChange} />,
    );
    instance = component.instance();
    const newDate = new Date('2018-09-30');
    instance.componentWillReceiveProps({ date: newDate });
    expect(instance.state.date).toEqual(newDate);
  });

  it('change date called', () => {
    const date = new Date();
    component = renderShallow(
      <DatePicker date={date} onDateChange={mockChange} />,
    );
    instance = component.instance();
    instance.datePicked(date);
    expect(mockChange).toHaveBeenCalledWith(date);
  });

  it('get date', () => {
    const date = new Date();
    component = renderShallow(
      <DatePicker date={date} onDateChange={mockChange} />,
    );
    instance = component.instance();
    const result = instance.getDate(date);
    expect(result).toEqual(date);
  });

  it('date change pressed', () => {
    const date = new Date();
    component = renderShallow(
      <DatePicker date={date} onDateChange={mockChange} />,
    );
    instance = component.instance();

    component
      .childAt(0)
      .props()
      .onPress();
    component.update();
    // date change
    const newDate = new Date('2019-09-01');
    component
      .childAt(1)
      .childAt(0)
      .childAt(0)
      .childAt(0)
      .props()
      .onDateChange(newDate);

    expect(instance.state.date).toEqual(newDate);
  });

  it('confirm pressed', () => {
    const date = new Date();
    component = renderShallow(
      <DatePicker
        date={date}
        onDateChange={mockChange}
        onCloseModal={mockCloseModal}
      />,
    );
    instance = component.instance();
    instance.datePicked = jest.fn();
    instance.closeModal = jest.fn();

    component
      .childAt(0)
      .props()
      .onPress();
    component.update();
    // Confirm button
    component
      .childAt(1)
      .childAt(0)
      .childAt(0)
      .childAt(1)
      .childAt(2)
      .props()
      .onPress();

    expect(instance.datePicked).toHaveBeenCalled();
    expect(instance.closeModal).toHaveBeenCalled();
    expect(mockCloseModal).toHaveBeenCalled();
  });

  it('cancel pressed', () => {
    const date = new Date();
    component = renderShallow(
      <DatePicker
        date={date}
        onDateChange={mockChange}
        onCloseModal={mockCloseModal}
      />,
    );
    instance = component.instance();
    instance.closeModal = jest.fn();

    component
      .childAt(0)
      .props()
      .onPress();
    component.update();
    // Cancel button
    component
      .childAt(1)
      .childAt(0)
      .childAt(0)
      .childAt(1)
      .childAt(0)
      .props()
      .onPress();
    expect(instance.closeModal).toHaveBeenCalled();
    expect(mockCloseModal).toHaveBeenCalled();
  });

  it('mask pressed cancels modal', () => {
    const date = new Date();
    component = renderShallow(
      <DatePicker
        date={date}
        onDateChange={mockChange}
        onCloseModal={mockCloseModal}
      />,
    );
    instance = component.instance();
    instance.closeModal = jest.fn();

    component
      .childAt(0)
      .props()
      .onPress();
    component.update();
    // Cancel button
    component
      .childAt(1)
      .childAt(0)
      .props()
      .onPress();
    expect(instance.closeModal).toHaveBeenCalled();
    expect(mockCloseModal).toHaveBeenCalled();
  });

  it('close modal', () => {
    const date = new Date();
    component = renderShallow(
      <DatePicker date={date} onDateChange={mockChange} />,
    );
    instance = component.instance();
    instance.setModalVisible = jest.fn();
    component
      .childAt(0)
      .props()
      .onPress();

    // Have to update the component because the internal state has changed
    component.update();
    component
      .childAt(1)
      .props()
      .onRequestClose();
    expect(instance.setModalVisible).toHaveBeenCalledWith(false);
  });

  it('set modal visible true', () => {
    const date = new Date();
    component = renderShallow(
      <DatePicker date={date} onDateChange={mockChange} />,
    );
    component
      .childAt(0)
      .props()
      .onPress();

    // Have to update the component because the internal state has changed
    component.update();
    expect(component.childAt(1).props().visible).toEqual(true);
  });

  it('set modal visible false', () => {
    const date = new Date();
    component = renderShallow(
      <DatePicker date={date} onDateChange={mockChange} />,
    );
    component
      .childAt(0)
      .props()
      .onPress();
    component.update();
    component
      .childAt(1)
      .props()
      .onRequestClose();
    component.update();

    expect(component.childAt(1).props().visible).toEqual(false);
  });

  it('modal visible snapshot', () => {
    const date = new Date();
    component = renderShallow(
      <DatePicker date={date} onDateChange={mockChange} />,
    );
    instance = component.instance();
    instance.setModalVisible(true);
    component.update();

    expect(component).toMatchSnapshot();
  });

  it('modal visible snapshot with title', () => {
    const date = new Date();
    component = renderShallow(
      <DatePicker date={date} onDateChange={mockChange} title="Test Title" />,
    );
    instance = component.instance();
    instance.setModalVisible(true);
    component.update();

    expect(component).toMatchSnapshot();
  });
});

describe('android date methods', () => {
  let component;
  let instance;
  const date = new Date();
  const minDate = new Date();
  const maxDate = new Date();
  const mockChange = jest.fn();
  const androidMode = 'default';

  beforeEach(() => {
    common.isAndroid = true;
  });

  it('renders for Android', () => {
    component = renderShallow(
      <DatePicker date={date} onDateChange={mockChange} />,
    );
    expect(component).toMatchSnapshot();
  });

  describe('mode is date', () => {
    beforeEach(() => {
      component = renderShallow(
        <DatePicker
          date={date}
          minDate={minDate}
          maxDate={maxDate}
          onDateChange={mockChange}
          androidMode={androidMode}
          mode="date"
        />,
      );

      instance = component.instance();
      instance.datePicked = jest.fn();
      instance.onPressCancel = jest.fn();
    });

    it('calls androidPickDate on press', () => {
      instance.androidPickDate = jest.fn();

      component
        .childAt(0)
        .props()
        .onPress();

      expect(instance.androidPickDate).toHaveBeenCalled();
    });

    it('loads DatePickerAndroid and picks date', async () => {
      const action = {
        action: 'test',
        year: '2018',
        month: '08',
        day: '13',
      };
      DatePickerAndroid.open.mockReturnValue(action);

      await instance.androidPickDate();

      expect(DatePickerAndroid.open).toHaveBeenCalledWith({
        date,
        minDate,
        maxDate,
        mode: androidMode,
      });
      expect(instance.state.date).toEqual(
        new Date(action.year, action.month, action.day),
      );
      expect(instance.datePicked).toHaveBeenCalled();
    });

    it('loads DatePickerAndroid and cancels', async () => {
      const action = {
        action: DatePickerAndroid.dismissedAction,
      };
      DatePickerAndroid.open.mockReturnValue(action);

      await instance.androidPickDate();

      expect(DatePickerAndroid.open).toHaveBeenCalledWith({
        date,
        minDate,
        maxDate,
        mode: androidMode,
      });
      expect(instance.onPressCancel).toHaveBeenCalled();
    });
  });

  describe('mode is time', () => {
    beforeEach(() => {
      component = renderShallow(
        <DatePicker
          date={date}
          onDateChange={mockChange}
          androidMode={androidMode}
          mode="time"
        />,
      );

      instance = component.instance();
      instance.datePicked = jest.fn();
      instance.onPressCancel = jest.fn();
    });

    it('calls androidPickTime on press', () => {
      instance.androidPickTime = jest.fn();

      component
        .childAt(0)
        .props()
        .onPress();

      expect(instance.androidPickTime).toHaveBeenCalled();
    });

    it('time picked', async () => {
      const action = {
        action: 'test',
        hour: '1',
        minute: '30',
      };
      TimePickerAndroid.open.mockReturnValue(action);

      await instance.androidPickTime();

      expect(TimePickerAndroid.open).toHaveBeenCalledWith({
        hour: moment(date).hour(),
        minute: moment(date).minutes(),
        is24Hour: true,
        mode: androidMode,
      });
      expect(instance.state.date).toEqual(
        moment()
          .hour(action.hour)
          .minute(action.minute)
          .toDate(),
      );
      expect(instance.datePicked).toHaveBeenCalled();
    });
  });

  describe('mode is datetime', () => {
    beforeEach(() => {
      component = renderShallow(
        <DatePicker
          date={date}
          minDate={minDate}
          maxDate={maxDate}
          onDateChange={mockChange}
          androidMode={androidMode}
          mode="datetime"
        />,
      );

      instance = component.instance();
      instance.datePicked = jest.fn();
      instance.onPressCancel = jest.fn();
    });

    it('calls androidPickDateTime on press', () => {
      instance.androidPickDateTime = jest.fn();

      component
        .childAt(0)
        .props()
        .onPress();

      expect(instance.androidPickDateTime).toHaveBeenCalled();
    });

    it('datetime picked', async () => {
      const dateAction = {
        action: 'test',
        year: '2018',
        month: '08',
        day: '13',
      };
      DatePickerAndroid.open.mockReturnValue(dateAction);
      const timeAction = {
        action: 'test',
        hour: '1',
        minute: '30',
      };
      TimePickerAndroid.open.mockReturnValue(timeAction);

      await instance.androidPickDateTime();

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
      expect(instance.datePicked).toHaveBeenCalled();
    });
  });
});
