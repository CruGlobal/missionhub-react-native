import React from 'react';
import { Text } from 'react-native';
import MockDate from 'mockdate';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import DatePicker from '../index.android';

const mockDate = '2018-09-12 12:00:00 PM GMT+0';
MockDate.set(mockDate);
const today = new Date();
const newDate = new Date('2010-01-01');

const onDateChange = jest.fn();

it('renders date picker touchable', () => {
  renderWithContext(
    <DatePicker date={today} onDateChange={onDateChange} />,
  ).snapshot();
});

it('renders with child component', () => {
  renderWithContext(
    <DatePicker date={today} onDateChange={onDateChange}>
      <Text>Child Component</Text>
    </DatePicker>,
  ).snapshot();
});

describe('DatePicker methods', () => {
  describe('mode is date', () => {
    describe('shows picker and picks date', () => {
      it('picks date', () => {
        const { getByText, getByTestId } = renderWithContext(
          <DatePicker mode="date" date={today} onDateChange={onDateChange}>
            <Text>Button Text</Text>
          </DatePicker>,
        );

        fireEvent.press(getByText('Button Text'));
        fireEvent(
          getByTestId('DateTimePicker'),
          'onChange',
          undefined,
          newDate,
        );

        expect(onDateChange).toHaveBeenCalledWith(newDate);
      });
    });

    describe('shows picker and cancels', () => {
      it('cancels', () => {
        const { getByText, getByTestId } = renderWithContext(
          <DatePicker mode="date" date={today} onDateChange={onDateChange}>
            <Text>Button Text</Text>
          </DatePicker>,
        );

        fireEvent.press(getByText('Button Text'));
        fireEvent(
          getByTestId('DateTimePicker'),
          'onChange',
          undefined,
          undefined,
        );

        expect(onDateChange).not.toHaveBeenCalledWith(newDate);
      });
    });
  });

  describe('mode is time', () => {
    describe('shows picker and picks time', () => {
      it('picks time', () => {
        const { getByText, getByTestId } = renderWithContext(
          <DatePicker mode="time" date={today} onDateChange={onDateChange}>
            <Text>Button Text</Text>
          </DatePicker>,
        );

        fireEvent.press(getByText('Button Text'));
        fireEvent(
          getByTestId('DateTimePicker'),
          'onChange',
          undefined,
          newDate,
        );

        expect(onDateChange).toHaveBeenCalledWith(newDate);
      });
    });
  });

  describe('mode is datetime', () => {
    describe('shows both pickers', () => {
      it('picks date and time', () => {
        const { getByText, getByTestId } = renderWithContext(
          <DatePicker date={today} onDateChange={onDateChange}>
            <Text>Button Text</Text>
          </DatePicker>,
        );

        fireEvent.press(getByText('Button Text'));
        fireEvent(
          getByTestId('DateTimePicker'),
          'onChange',
          undefined,
          newDate,
        );
        fireEvent(
          getByTestId('DateTimePicker'),
          'onChange',
          undefined,
          newDate,
        );

        expect(onDateChange).toHaveBeenCalledWith(newDate);
      });
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
});
