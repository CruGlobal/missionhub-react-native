import React from 'react';
import { Animated } from 'react-native';
import MockDate from 'mockdate';
import moment from 'moment';

import DatePicker from '../../src/components/DatePicker';
import { testSnapshotShallow, renderShallow } from '../../testUtils';

const mockDate = '2018-09-12 12:00:00 PM GMT+0';
MockDate.set(mockDate);

jest.mock('moment', () => {
  const moment = require.requireActual('moment');
  return moment.utc;
});

Animated.timing = jest.fn(() => ({
  start: jest.fn(a => a && a()),
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
      <DatePicker date={date} onDateChange={mockChange} />,
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
  });

  it('cancel pressed', () => {
    const date = new Date();
    component = renderShallow(
      <DatePicker date={date} onDateChange={mockChange} />,
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

  it('onTimePicked method', () => {
    const date = new Date();
    component = renderShallow(
      <DatePicker date={date} onDateChange={mockChange} />,
    );
    instance = component.instance();
    const action = {
      action: 'test',
      hour: '10',
      minute: '30',
    };
    instance.onTimePicked(action);
    const finalDate = moment()
      .hour(action.hour)
      .minute(action.minute)
      .toDate()
      .valueOf();
    expect(instance.state.date.valueOf()).toEqual(finalDate);
  });

  it('onDatetimeTimePicked method', () => {
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
      hour: '10',
      minute: '30',
    };
    instance.onDatetimeTimePicked(
      action.year,
      action.month,
      action.day,
      action,
    );
    const finalDate = new Date(
      action.year,
      action.month,
      action.day,
      action.hour,
      action.minute,
    ).valueOf();
    expect(instance.state.date.valueOf()).toEqual(finalDate);
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
