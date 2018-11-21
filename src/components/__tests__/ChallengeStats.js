import React from 'react';
import MockDate from 'mockdate';
import moment from 'moment';

import ChallengeStats from '../ChallengeStats';
import { testSnapshotShallow } from '../../../testUtils';

MockDate.set(
  moment('2018-09-15')
    .endOf('day')
    .utc()
    .toDate(),
);

const item = {
  created_at: '2018-09-01T12:00:00Z',
  end_date: '2018-09-30T12:00:00Z',
  accepted_count: 5,
  completed_count: 3,
  isPast: false,
};

it('render active challenge item', () => {
  testSnapshotShallow(<ChallengeStats challenge={item} />);
});
it('render small active challenge item', () => {
  testSnapshotShallow(<ChallengeStats challenge={item} small={true} />);
});

it('render past challenge item', () => {
  testSnapshotShallow(
    <ChallengeStats
      challenge={{
        ...item,
        isPast: true,
      }}
    />,
  );
});

it('render small past challenge item', () => {
  testSnapshotShallow(
    <ChallengeStats challenge={{ ...item, isPast: true }} small={true} />,
  );
});
