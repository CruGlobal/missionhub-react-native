import React from 'react';
import { Animated, Text } from 'react-native';
import MockDate from 'mockdate';

import { testSnapshotShallow, renderShallow } from '../../../../testUtils';
import DatePicker from '../index.ios';

const mockDate = '2018-09-12 12:00:00 PM GMT+0';
MockDate.set(mockDate);
const today = new Date();

// @ts-ignore
Animated.timing = jest.fn(() => ({
  start: jest.fn(a => a && a()),
}));

it('renders default date picker', () => {
  // @ts-ignore
  testSnapshotShallow(<DatePicker date={today} />);
});

it('renders date only date picker', () => {
  // @ts-ignore
  testSnapshotShallow(<DatePicker date={today} mode="date" />);
});

it('renders datetime only date picker', () => {
  // @ts-ignore
  testSnapshotShallow(<DatePicker date={today} mode="datetime" />);
});

it('renders time only date picker', () => {
  // @ts-ignore
  testSnapshotShallow(<DatePicker date={today} mode="time" />);
});

it('renders date only date picker with min date', () => {
  testSnapshotShallow(
    // @ts-ignore
    <DatePicker date={today} mode="date" minDate={new Date()} />,
  );
});

it('renders date only date picker with max date', () => {
  testSnapshotShallow(
    // @ts-ignore
    <DatePicker date={today} mode="date" maxDate={new Date()} />,
  );
});

it('renders with child component', () => {
  testSnapshotShallow(
    // @ts-ignore
    <DatePicker date={today}>
      <Text>Child Component</Text>
    </DatePicker>,
  );
});

it('renders with additional modal component', () => {
  testSnapshotShallow(
    // @ts-ignore
    <DatePicker date={today} iOSModalContent={<Text>Modal Component</Text>} />,
  );
});

it('renders date with custom title', () => {
  // @ts-ignore
  testSnapshotShallow(<DatePicker date={today} title={'Title'} />);
});

describe('DatePicker methods', () => {
  // @ts-ignore
  let component;
  // @ts-ignore
  let instance;
  const mockChange = jest.fn();
  const mockCloseModal = jest.fn();
  const date = new Date();

  beforeEach(() => {
    component = renderShallow(
      <DatePicker
        // @ts-ignore
        date={date}
        onDateChange={mockChange}
        onCloseModal={mockCloseModal}
      />,
    );
    instance = component.instance();
  });

  it('starts with modal not visible', () => {
    // @ts-ignore
    expect(component.childAt(1).props().visible).toEqual(false);
    // @ts-ignore
    expect(instance.state.modalVisible).toEqual(false);
  });

  describe('touchable pressed', () => {
    beforeEach(() => {
      // @ts-ignore
      component
        .childAt(0)
        .props()
        .onPress();
      // @ts-ignore
      component.update();
    });

    it('modal visible', () => {
      // @ts-ignore
      expect(component.childAt(1).props().visible).toEqual(true);
      // @ts-ignore
      expect(instance.state.modalVisible).toEqual(true);
    });

    it('receive new date prop', () => {
      const newDate = new Date('2018-09-30');
      // @ts-ignore
      instance.UNSAFE_componentWillReceiveProps({ date: newDate });

      // @ts-ignore
      expect(instance.state.date).toEqual(newDate);
    });

    it('date change pressed', () => {
      const newDate = new Date('2019-09-01');
      // @ts-ignore
      component
        .childAt(1)
        .childAt(1)
        .childAt(0)
        .props()
        .onDateChange(newDate);

      // @ts-ignore
      expect(instance.state.date).toEqual(newDate);
    });

    it('confirm pressed', () => {
      // @ts-ignore
      component
        .childAt(1)
        .childAt(1)
        .childAt(1)
        .childAt(2)
        .props()
        .onPress();
      // @ts-ignore
      component.update();

      expect(mockChange).toHaveBeenCalledWith(date);
      // @ts-ignore
      expect(component.childAt(1).props().visible).toEqual(false);
      // @ts-ignore
      expect(instance.state.modalVisible).toEqual(false);
      expect(mockCloseModal).toHaveBeenCalled();
    });

    it('cancel pressed', () => {
      // @ts-ignore
      component
        .childAt(1)
        .childAt(1)
        .childAt(1)
        .childAt(0)
        .props()
        .onPress();
      // @ts-ignore
      component.update();

      // @ts-ignore
      expect(component.childAt(1).props().visible).toEqual(false);
      // @ts-ignore
      expect(instance.state.modalVisible).toEqual(false);
      expect(mockCloseModal).toHaveBeenCalled();
    });

    it('mask pressed cancels modal', () => {
      // @ts-ignore
      component
        .childAt(1)
        .childAt(0)
        .props()
        .onPress();
      // @ts-ignore
      component.update();

      // @ts-ignore
      expect(component.childAt(1).props().visible).toEqual(false);
      // @ts-ignore
      expect(instance.state.modalVisible).toEqual(false);
      expect(mockCloseModal).toHaveBeenCalled();
    });

    it('modal request close', () => {
      // @ts-ignore
      component
        .childAt(1)
        .props()
        .onRequestClose();
      // @ts-ignore
      component.update();

      // @ts-ignore
      expect(component.childAt(1).props().visible).toEqual(false);
      // @ts-ignore
      expect(instance.state.modalVisible).toEqual(false);
    });
  });

  describe('custom action on press', () => {
    const onPressIOS = jest.fn();

    beforeEach(async () => {
      component = renderShallow(
        <DatePicker
          // @ts-ignore
          date={date}
          onPressIOS={onPressIOS}
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
      expect(onPressIOS).toHaveBeenCalledWith({
        // @ts-ignore
        showPicker: instance.showPicker,
      });
    });
  });
});
