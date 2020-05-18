import moment from 'moment';
import MockDate from 'mockdate';

import {
  getDate,
  modeIs24Hour,
  formatApiDate,
  isLastTwelveHours,
  getMomentDate,
} from '../date';

const mockDate = '2018-09-12 12:00:00 PM GMT+0';
MockDate.set(mockDate);

describe('getDate', () => {
  it('formats date string', () => {
    expect(getDate(mockDate)).toEqual(moment(mockDate).toDate());
  });

  it('returns Date instance as is', () => {
    const date = new Date();
    expect(getDate(date)).toEqual(date);
  });
});

describe('isLastTwelveHours', () => {
  it('returns true for date that was in the last 12 hours', () => {
    expect(isLastTwelveHours(getMomentDate(mockDate))).toEqual(true);
  });
  it('returns false for date past twelve hours', () => {
    const date = getMomentDate('2020-04-15 12:00:00 PM GMT+0');

    expect(isLastTwelveHours(date)).toEqual(false);
  });
});

describe('modeIs24Hour', () => {
  it('format has h', () => {
    expect(modeIs24Hour('hh:mm')).toEqual(false);
  });

  it('format has a', () => {
    expect(modeIs24Hour('aa')).toEqual(false);
  });

  it('format has neither h nor a', () => {
    expect(modeIs24Hour('HH:mm')).toEqual(true);
  });
});

describe('formatAPIDate', () => {
  // eslint-disable-next-line
  expect(formatApiDate()).toMatchInlineSnapshot(`"2018-09-12T12:00:00+00:00"`);
});
