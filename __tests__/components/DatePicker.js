import React from 'react';
import { Animated, TimePickerAndroid, DatePickerAndroid } from 'react-native';
import MockDate from 'mockdate';

import DatePicker from '../../src/components/DatePicker';
import { testSnapshotShallow, renderShallow } from '../../testUtils';
import * as common from '../../src/utils/common';

const mockDate = '2018-09-12 12:00:00 PM GMT+0';
MockDate.set(mockDate);

jest.mock('moment', () => {
  const moment = require.requireActual('moment');
  return moment.utc;
});

Animated.timing = jest.fn(() => ({
  start: jest.fn(a => a && a()),
}));

TimePickerAndroid.open = jest.fn(() => ({
  then: jest.fn(a => a && a()),
}));
DatePickerAndroid.open = jest.fn(() => ({
  then: jest.fn(a => a && a()),
}));

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

it('renders date only date picker with placeholder', () => {
  testSnapshotShallow(
    <DatePicker date={today} mode="date" placeholder="Test Placeholder" />,
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
    const dateStr = instance.getDateStr(date);
    expect(mockChange).toHaveBeenCalledWith(dateStr, date);
  });

  it('change date called with custom date string', () => {
    const date = new Date();
    const customFormat = 'custom format';
    const mockDateStr = jest.fn(() => customFormat);
    component = renderShallow(
      <DatePicker
        date={date}
        onDateChange={mockChange}
        getDateStr={mockDateStr}
      />,
    );
    instance = component.instance();
    instance.datePicked(date);
    expect(mockChange).toHaveBeenCalledWith(customFormat, date);
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

    component.props().onPress();
    component.update();
    // date change
    const newDate = new Date('2019-09-01');
    component
      .childAt(0)
      .childAt(1)
      .childAt(0)
      .childAt(0)
      .childAt(0)
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

    component.props().onPress();
    component.update();
    // Confirm button
    component
      .childAt(0)
      .childAt(1)
      .childAt(0)
      .childAt(0)
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

    component.props().onPress();
    component.update();
    // Cancel button
    component
      .childAt(0)
      .childAt(1)
      .childAt(0)
      .childAt(0)
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

    component.props().onPress();
    component.update();
    // Cancel button
    component
      .childAt(0)
      .childAt(1)
      .childAt(0)
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
    component.props().onPress();

    // Have to update the component because the internal state has changed
    component.update();
    component
      .childAt(0)
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
    component.props().onPress();

    // Have to update the component because the internal state has changed
    component.update();
    expect(
      component
        .childAt(0)
        .childAt(1)
        .props().visible,
    ).toEqual(true);
  });

  it('set modal visible false', () => {
    const date = new Date();
    component = renderShallow(
      <DatePicker date={date} onDateChange={mockChange} />,
    );
    component.props().onPress();
    component.update();
    component
      .childAt(0)
      .childAt(1)
      .props()
      .onRequestClose();
    component.update();

    expect(
      component
        .childAt(0)
        .childAt(1)
        .props().visible,
    ).toEqual(false);
  });

  it('onDatePicked method', () => {
    const date = new Date();
    component = renderShallow(
      <DatePicker date={date} onDateChange={mockChange} />,
    );
    instance = component.instance();
    const action = {
      action: 'test',
      year: '2018',
      month: '08',
      day: '13',
    };
    instance.onDatePicked(action);
    expect(instance.state.date).toEqual(
      new Date(action.year, action.month, action.day),
    );
  });

  it('onDatePicked method canceled', () => {
    const date = new Date();
    component = renderShallow(
      <DatePicker date={date} onDateChange={mockChange} />,
    );
    instance = component.instance();
    instance.onPressCancel = jest.fn();
    const action = {
      action: DatePickerAndroid.dismissedAction,
      year: '2018',
      month: '08',
      day: '13',
    };
    instance.onDatePicked(action);
    expect(instance.onPressCancel).toHaveBeenCalled();
  });

  it('onTimePicked method', () => {
    const date = new Date();
    component = renderShallow(
      <DatePicker date={date} onDateChange={mockChange} />,
    );
    instance = component.instance();
    instance.onPressCancel = jest.fn();
    const action = {
      action: DatePickerAndroid.dismissedAction,
      hour: '10',
      minute: '30',
    };
    instance.onTimePicked(action);
    expect(instance.onPressCancel).toHaveBeenCalled();
  });

  it('onDatetimePicked method', () => {
    const date = new Date();
    component = renderShallow(
      <DatePicker date={date} onDateChange={mockChange} />,
    );
    instance = component.instance();
    instance.onPressCancel = jest.fn();
    const action = {
      action: DatePickerAndroid.dismissedAction,
      year: '2018',
      month: '08',
      day: '13',
    };
    instance.onDatetimePicked(action);
    expect(instance.onPressCancel).toHaveBeenCalled();
  });

  it('onDatetimeTimePicked method', () => {
    const date = new Date();
    component = renderShallow(
      <DatePicker date={date} onDateChange={mockChange} />,
    );
    instance = component.instance();
    instance.onPressCancel = jest.fn();
    const action = {
      action: DatePickerAndroid.dismissedAction,
      year: '2018',
      month: '08',
      day: '13',
      hour: '10',
      minute: '30',
    };
    instance.onDatetimeTimePicked(
      action.year,
      action.month,
      action.day,
      action,
    );
    expect(instance.onPressCancel).toHaveBeenCalled();
  });

  it('modal visible snapshot', () => {
    const date = new Date();
    component = renderShallow(
      <DatePicker date={date} onDateChange={mockChange} />,
    );
    instance = component.instance();
    instance.setModalVisible(true);
    expect(component).toMatchSnapshot();
  });

  it('input component snapshot', () => {
    const date = new Date();
    component = renderShallow(
      <DatePicker date={date} onDateChange={mockChange} />,
    );
    instance = component.instance();
    const inputComponent = instance.renderInput();
    expect(inputComponent).toMatchSnapshot();
  });

  it('modal visible snapshot with title', () => {
    const date = new Date();
    component = renderShallow(
      <DatePicker date={date} onDateChange={mockChange} title="Test Title" />,
    );
    instance = component.instance();
    instance.setModalVisible(true);
    expect(component).toMatchSnapshot();
  });
});

describe('android date methods', () => {
  let component;
  let instance;
  const mockChange = jest.fn();

  it('on press date mode date', () => {
    const date = new Date();
    common.isAndroid = true;
    component = renderShallow(
      <DatePicker date={date} onDateChange={mockChange} mode="date" />,
    );
    instance = component.instance();
    instance.onDatePicked = jest.fn();

    component.props().onPress();

    expect(instance.onDatePicked).toHaveBeenCalled();
  });

  it('on press date mode time', () => {
    const date = new Date();
    common.isAndroid = true;
    component = renderShallow(
      <DatePicker date={date} onDateChange={mockChange} mode="time" />,
    );
    instance = component.instance();
    instance.onTimePicked = jest.fn();

    component.props().onPress();

    expect(instance.onTimePicked).toHaveBeenCalled();
  });

  it('on press date mode datetime', () => {
    const date = new Date();
    common.isAndroid = true;
    component = renderShallow(
      <DatePicker date={date} onDateChange={mockChange} mode="datetime" />,
    );
    instance = component.instance();
    instance.onDatetimePicked = jest.fn();

    component.props().onPress();

    expect(instance.onDatetimePicked).toHaveBeenCalled();
  });

  it('android render', () => {
    const date = new Date();
    common.isAndroid = true;
    component = renderShallow(
      <DatePicker date={date} onDateChange={mockChange} />,
    );
    expect(component).toMatchSnapshot();
  });
});
