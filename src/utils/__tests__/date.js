import moment from 'moment';
import MockDate from 'mockdate';

import { getDate, modeIs24Hour } from '../date';

const mockDate = '2018-09-12 12:00:00 PM GMT+0';
const mockMinDate = '2019-10-13 12:00:00 PM GMT+0';
const mockMaxDate = '2017-08-10 11:00:00 PM GMT+0';
MockDate.set(mockDate);

describe('getDate', () => {
  it('formats date string', () => {
    expect(getDate(mockDate)).toEqual(moment(mockDate).toDate());
  });

  it('returns Date instance as is', () => {
    const date = new Date();
    expect(getDate(date)).toEqual(date);
  });

  it('defaults to min date', () => {
    expect(getDate(undefined, mockMinDate)).toEqual(
      moment(mockMinDate).toDate(),
    );
  });

  it('defaults to max date', () => {
    expect(getDate(undefined, undefined, mockMaxDate)).toEqual(
      moment(mockMaxDate).toDate(),
    );
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
