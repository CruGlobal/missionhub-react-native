import React from 'react';
import MockDate from 'mockdate';

import ChallengeDetailHeader from '../../../components/ChallengeDetailHeader';
import { renderWithContext } from '../../../../testUtils';

const mockDate = '2019-08-25 12:00:00 PM GMT+0';
MockDate.set(mockDate);

const activeChallenge = {
  id: '1',
  accepted_count: 1,
  completed_count: 1,
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
  renderWithContext(
    <ChallengeDetailHeader challenge={activeChallenge} />,
  ).snapshot();
});

it('renders with details', () => {
  renderWithContext(
    <ChallengeDetailHeader challenge={challengeWithDetails} />,
  ).snapshot();
});

it('render for past challenge', () => {
  renderWithContext(
    <ChallengeDetailHeader challenge={pastChallenge} />,
  ).snapshot();
});
