import React from 'react';
import { Animated, Text } from 'react-native';
import MockDate from 'mockdate';
import { fireEvent } from 'react-native-testing-library';
import i18n from 'i18next';

import { renderWithContext } from '../../../../testUtils';
import DatePicker from '../index.ios';

jest.mock('lodash.debounce', () => jest.fn(fn => fn));

const mockDate = '2018-09-12 12:00:00 PM GMT+0';
MockDate.set(mockDate);
const today = new Date();
const newDate = new Date('2010-01-01');

// @ts-ignore
Animated.timing = jest.fn(() => ({
  start: jest.fn(a => a && a()),
}));

const onDateChange = jest.fn();

it('renders default date picker', () => {
  renderWithContext(
    <DatePicker date={today} onDateChange={onDateChange} />,
  ).snapshot();
});

it('renders date only date picker', () => {
  renderWithContext(
    <DatePicker date={today} mode="date" onDateChange={onDateChange} />,
  ).snapshot();
});

it('renders datetime only date picker', () => {
  renderWithContext(
    <DatePicker date={today} mode="datetime" onDateChange={onDateChange} />,
  ).snapshot();
});

it('renders time only date picker', () => {
  renderWithContext(
    <DatePicker date={today} mode="time" onDateChange={onDateChange} />,
  ).snapshot();
});

it('renders date only date picker with min date', () => {
  renderWithContext(
    <DatePicker
      date={today}
      mode="date"
      minimumDate={new Date()}
      onDateChange={onDateChange}
    />,
  ).snapshot();
});

it('renders with child component', () => {
  renderWithContext(
    <DatePicker date={today} onDateChange={onDateChange}>
      <Text>Child Component</Text>
    </DatePicker>,
  ).snapshot();
});

it('renders with additional modal component', () => {
  renderWithContext(
    <DatePicker
      date={today}
      iOSModalContent={<Text>Modal Component</Text>}
      onDateChange={onDateChange}
    />,
  ).snapshot();
});

describe('DatePicker methods', () => {
  it('should open modal', () => {
    const { getByText, recordSnapshot, diffSnapshot } = renderWithContext(
      <DatePicker date={today} onDateChange={onDateChange}>
        <Text>Button Text</Text>
      </DatePicker>,
    );

    recordSnapshot();
    fireEvent.press(getByText('Button Text'));
    diffSnapshot();
  });

  it('date change pressed', () => {
    const { getByText, getByTestId } = renderWithContext(
      <DatePicker date={today} onDateChange={onDateChange}>
        <Text>Button Text</Text>
      </DatePicker>,
    );

    fireEvent.press(getByText('Button Text'));
    fireEvent(getByTestId('DateTimePicker'), 'onChange', undefined, newDate);
    fireEvent.press(getByText(i18n.t('datePicker:done')));

    expect(onDateChange).toHaveBeenCalledWith(newDate);
  });

  it('cancel pressed', () => {
    const { getByText, getByTestId } = renderWithContext(
      <DatePicker date={today} onDateChange={onDateChange}>
        <Text>Button Text</Text>
      </DatePicker>,
    );

    fireEvent.press(getByText('Button Text'));
    fireEvent(getByTestId('DateTimePicker'), 'onChange', undefined, newDate);
    fireEvent.press(getByText(i18n.t('datePicker:cancel')));

    expect(onDateChange).not.toHaveBeenCalled();
  });
});

describe('custom action on press', () => {
  it('calls custom action and passes in showPicker', () => {
    const onPress = jest.fn();
    const { getByText } = renderWithContext(
      <DatePicker date={today} onPress={onPress} onDateChange={onDateChange}>
        <Text>Button Text</Text>
      </DatePicker>,
    );

    fireEvent.press(getByText('Button Text'));

    expect(onPress).toHaveBeenCalledWith({
      showPicker: expect.any(Function),
    });
  });
});
