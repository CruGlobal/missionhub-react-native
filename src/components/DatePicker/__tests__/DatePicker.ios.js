/* eslint max-lines-per-function: 0 */
import React from 'react';
import { Animated, Text } from 'react-native';
import MockDate from 'mockdate';

import {
  testSnapshotShallow,
  renderShallow,
} from '../../../../testUtils/index';
import DatePicker from '../index.ios.js';

const mockDate = '2018-09-12 12:00:00 PM GMT+0';
MockDate.set(mockDate);
const today = new Date();

Animated.timing = jest.fn(() => ({
  start: jest.fn(a => a && a()),
}));

it('renders default date picker', () => {
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

it('renders with additional modal component', () => {
  testSnapshotShallow(
    <DatePicker date={today} iOSModalContent={<Text>Modal Component</Text>} />,
  );
});

it('renders date with custom title', () => {
  testSnapshotShallow(<DatePicker date={today} title={'Title'} />);
});

describe('DatePicker methods', () => {
  let component;
  let instance;
  const mockChange = jest.fn();
  const mockCloseModal = jest.fn();
  const date = new Date();

  beforeEach(() => {
    component = renderShallow(
      <DatePicker
        date={date}
        onDateChange={mockChange}
        onCloseModal={mockCloseModal}
      />,
    );
    instance = component.instance();
  });

  it('starts with modal not visible', () => {
    expect(component.childAt(1).props().visible).toEqual(false);
    expect(instance.state.modalVisible).toEqual(false);
  });

  describe('touchable pressed', () => {
    beforeEach(() => {
      component
        .childAt(0)
        .props()
        .onPress();
      component.update();
    });

    it('modal visible', () => {
      expect(component.childAt(1).props().visible).toEqual(true);
      expect(instance.state.modalVisible).toEqual(true);
    });

    it('receive new date prop', () => {
      const newDate = new Date('2018-09-30');
      instance.UNSAFE_componentWillReceiveProps({ date: newDate });

      expect(instance.state.date).toEqual(newDate);
    });

    it('date change pressed', () => {
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
      component
        .childAt(1)
        .childAt(0)
        .childAt(0)
        .childAt(1)
        .childAt(2)
        .props()
        .onPress();
      component.update();

      expect(mockChange).toHaveBeenCalledWith(date);
      expect(component.childAt(1).props().visible).toEqual(false);
      expect(instance.state.modalVisible).toEqual(false);
      expect(mockCloseModal).toHaveBeenCalled();
    });

    it('cancel pressed', () => {
      component
        .childAt(1)
        .childAt(0)
        .childAt(0)
        .childAt(1)
        .childAt(0)
        .props()
        .onPress();
      component.update();

      expect(component.childAt(1).props().visible).toEqual(false);
      expect(instance.state.modalVisible).toEqual(false);
      expect(mockCloseModal).toHaveBeenCalled();
    });

    it('mask pressed cancels modal', () => {
      component
        .childAt(1)
        .childAt(0)
        .props()
        .onPress();
      component.update();

      expect(component.childAt(1).props().visible).toEqual(false);
      expect(instance.state.modalVisible).toEqual(false);
      expect(mockCloseModal).toHaveBeenCalled();
    });

    it('modal request close', () => {
      component
        .childAt(1)
        .props()
        .onRequestClose();
      component.update();

      expect(component.childAt(1).props().visible).toEqual(false);
      expect(instance.state.modalVisible).toEqual(false);
    });
  });
});
