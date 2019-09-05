import React from 'react';
import MockDate from 'mockdate';
import { fireEvent } from 'react-native-testing-library';

import ChallengeDetailHeader from '../../../components/ChallengeDetailHeader';
import { renderWithContext } from '../../../../testUtils';

const mockDate = '2019-08-25 12:00:00 PM GMT+0';
MockDate.set(mockDate);

const activeChallenge = {
  isPast: false,
  title: 'Challenge Title',
  end_date: mockDate,
};

const pastChallenge = {
  ...activeChallenge,
  isPast: true,
};

const props = {
  challenge: activeChallenge,
  canEditChallenges: false,
  onEdit: jest.fn(),
};

it('render for active challenge', () => {
  renderWithContext(<ChallengeDetailHeader {...props} />, {
    noWrappers: true,
  }).snapshot();
});

it('render for active challenge with edit', () => {
  renderWithContext(
    <ChallengeDetailHeader {...props} canEditChallenges={true} />,
    { noWrappers: true },
  ).snapshot();
});

it('render for past challenge', () => {
  renderWithContext(
    <ChallengeDetailHeader
      {...props}
      canEditChallenges={true}
      challenge={pastChallenge}
    />,
    { noWrappers: true },
  ).snapshot();
});

it('should call onEdit from press', () => {
  const { getByTestId } = renderWithContext(
    <ChallengeDetailHeader {...props} canEditChallenges={true} />,
    { noWrappers: true },
  );

  fireEvent.press(getByTestId('ChallengeDetailHeaderEditButton'));

  expect(props.onEdit).toHaveBeenCalledWith(activeChallenge);
});
