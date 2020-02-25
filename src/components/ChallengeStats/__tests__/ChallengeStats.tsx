import React from 'react';
import MockDate from 'mockdate';

import { renderWithContext } from '../../../../testUtils';

import ChallengeStats from '..';

jest.mock('../../../actions/celebration');

const mockDate = '2019-08-25 12:00:00 PM GMT+0';
MockDate.set(mockDate);

const organization = { id: '456' };
const date = '2019-08-25';
const daysAgo2 = '2019-08-23';
const daysAhead1 = '2019-08-26';
const challenge = {
  id: '1',
  creator_id: 'person1',
  organization_id: organization.id,
  title: 'Read "There and Back Again"',
  end_date: date,
  accepted_count: 5,
  completed_count: 3,
  isPast: false,
  created_at: daysAgo2,
};
const props = {
  challenge,
};

it('render challenge stats', () => {
  renderWithContext(<ChallengeStats {...props} />, {
    noWrappers: true,
  }).snapshot();
});

it('render challenge stats | DetailScreen', () => {
  renderWithContext(<ChallengeStats {...props} isDetailScreen={true} />, {
    noWrappers: true,
  }).snapshot();
});

it('render challenge stats small with style', () => {
  renderWithContext(
    <ChallengeStats {...props} isDetailScreen={false} style={{ padding: 5 }} />,
    {
      noWrappers: true,
    },
  ).snapshot();
});

it('render challenge stats with style', () => {
  renderWithContext(<ChallengeStats {...props} style={{ padding: 5 }} />, {
    noWrappers: true,
  }).snapshot();
});

it('render past challenge stats', () => {
  renderWithContext(
    <ChallengeStats
      {...props}
      challenge={{
        ...challenge,
        isPast: true,
      }}
    />,
    { noWrappers: true },
  ).snapshot();
});

it('render upcoming challenge stats', () => {
  renderWithContext(
    <ChallengeStats
      {...props}
      challenge={{
        ...challenge,
        end_date: daysAhead1,
      }}
    />,
    { noWrappers: true },
  ).snapshot();
});
