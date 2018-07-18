import React from 'react';
import 'react-native';

import { DateComponent } from '../../src/components/common';
import { testSnapshotShallow, renderShallow } from '../../testUtils';

Date.now = jest.fn(() => new Date(Date.UTC(2018, 5, 11, 12, 0, 0)).valueOf());

it('renders correctly', () => {
  testSnapshotShallow(<DateComponent date="2017-11-20" />);
});

describe('relative formatting', () => {
  const testDateFormat = (date, formattedText) => {
    const component = renderShallow(
      <DateComponent date={date} format={'relative'} />,
    );

    const text = component.find('MyText').props().children;

    expect(text).toEqual(formattedText);
  };

  it('renders today', () => {
    testDateFormat('2018-06-11 12:00:00 UTC', 'Today');
  });

  it('renders yesterday', () => {
    testDateFormat('2018-06-10 12:00:00 UTC', 'Yesterday');
  });

  it('renders date from last week', () => {
    testDateFormat('2018-06-09 12:00:00 UTC', 'Saturday');
    testDateFormat('2018-06-04 12:00:00 UTC', 'Monday');
  });

  it('renders from this year', () => {
    testDateFormat('2018-06-03 12:00:00 UTC', 'Sunday, June 3');
    testDateFormat('2018-05-23 12:00:00 UTC', 'Wednesday, May 23');
  });

  it('renders from before this year', () => {
    testDateFormat('2017-12-31 12:00:00 UTC', 'Sunday, December 31 2017');
    testDateFormat('2005-02-14 12:00:00 UTC', 'Monday, February 14 2005');
  });
});
