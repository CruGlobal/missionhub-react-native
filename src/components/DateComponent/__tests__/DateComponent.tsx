import React from 'react';
import MockDate from 'mockdate';
import moment from 'moment';

import DateComponent from '..';

import { testSnapshotShallow, renderWithContext } from '../../../../testUtils';

MockDate.set(moment('2018-06-11 12:00:00').toDate(), 0);

it('renders correctly', () => {
  testSnapshotShallow(<DateComponent date="2017-11-20" />);
});

const testFormat = (date: string, formattedText: string, format: string) => {
  const component = renderWithContext(
    <DateComponent date={date} format={format} />,
    { hasStore: false },
  );

  const text = component.getByTestId('Text').props.children;

  expect(text).toEqual(formattedText);
};

describe('relative formatting', () => {
  const testDateFormat = (date: string, format: string) =>
    testFormat(date, format, 'relative');

  it('renders today', () => {
    testDateFormat('2018-06-11 12:00:00', 'Today');
  });

  it('renders yesterday', () => {
    testDateFormat('2018-06-10 12:00:00', 'Yesterday');
  });

  it('renders date from last week', () => {
    testDateFormat('2018-06-09 12:00:00', 'Saturday');
    testDateFormat('2018-06-04 12:00:00', 'Monday');
  });

  it('renders from this year', () => {
    testDateFormat('2018-06-03 12:00:00', 'Sunday, June 3');
    testDateFormat('2018-05-23 12:00:00', 'Wednesday, May 23');
  });

  it('renders from before this year', () => {
    testDateFormat('2017-12-31 12:00:00', 'Sunday, December 31 2017');
    testDateFormat('2005-02-14 12:00:00', 'Monday, February 14 2005');
  });
});

describe('comment formatting', () => {
  const testDateFormat = (date: string, format: string) =>
    testFormat(date, format, 'comment');

  it('renders today', () => {
    testDateFormat('2018-06-11 12:00:00', '12:00 PM');
  });

  it('renders yesterday', () => {
    testDateFormat('2018-06-10 12:00:00', 'Yesterday @ 12:00 PM');
  });

  it('renders date from last week', () => {
    testDateFormat('2018-06-09 12:00:00', 'Saturday @ 12:00 PM');
    testDateFormat('2018-06-07 12:00:00', 'Thursday @ 12:00 PM');
    testDateFormat('2018-06-04 12:00:00', 'Monday @ 12:00 PM');
  });

  it('renders from this year', () => {
    testDateFormat('2018-06-03 12:00:00', 'June 3 @ 12:00 PM');
    testDateFormat('2018-05-23 12:00:00', 'May 23 @ 12:00 PM');
  });

  it('renders from before this year', () => {
    testDateFormat('2017-12-31 12:00:00', 'December 31, 2017 @ 12:00 PM');
    testDateFormat('2005-02-14 12:00:00', 'February 14, 2005 @ 12:00 PM');
  });
});
