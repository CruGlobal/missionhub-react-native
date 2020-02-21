import React from 'react';
import MockDate from 'mockdate';

import ChallengeDetailHeader from '../../../components/ChallengeDetailHeader';
import { renderWithContext } from '../../../../testUtils';

const mockDate = '2019-08-25 12:00:00 PM GMT+0';
MockDate.set(mockDate);

const activeChallenge = {
  isPast: false,
  title: 'Challenge Title',
  end_date: mockDate,
};

const challengeWithDetails = {
  ...activeChallenge,
  details_markdown: 'Super cool details',
};

const pastChallenge = {
  ...activeChallenge,
  isPast: true,
};

it('render for active challenge', () => {
  renderWithContext(<ChallengeDetailHeader challenge={activeChallenge} />, {
    noWrappers: true,
  }).snapshot();
});

it('renders with details', () => {
  renderWithContext(
    <ChallengeDetailHeader challenge={challengeWithDetails} />,
    {
      noWrappers: true,
    },
  ).snapshot();
});

it('render for past challenge', () => {
  renderWithContext(<ChallengeDetailHeader challenge={pastChallenge} />, {
    noWrappers: true,
  }).snapshot();
});
