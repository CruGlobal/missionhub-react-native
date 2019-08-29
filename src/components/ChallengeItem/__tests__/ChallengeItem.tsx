import React from 'react';
import MockDate from 'mockdate';
import moment from 'moment';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';

import ChallengeItem from '..';

jest.mock('../../../actions/celebration');

MockDate.set(
  moment('2019-08-25')
    .endOf('day')
    .utc()
    .toDate(),
);

const organization = { id: '456' };
const date = '2018-09-22';
const acceptedChallenge = { id: 'a1', title: 'Accepted' };
const completedChallenge = { ...acceptedChallenge, completed_at: date };
const item = {
  id: '1',
  creator_id: 'person1',
  organization_id: organization.id,
  title: 'Read "There and Back Again"',
  end_date: date,
  accepted_count: 5,
  completed_count: 3,
  isPast: false,
  created_at: '2018-09-01T12:00:00Z',
};
const props = {
  item,
  onComplete: jest.fn(),
  onJoin: jest.fn(),
  onSelect: jest.fn(),
};

it('render active challenge item', () => {
  renderWithContext(<ChallengeItem {...props} />, {
    noWrappers: true,
  }).snapshot();
});

it('render active and joined challenge item', () => {
  renderWithContext(
    <ChallengeItem {...props} acceptedChallenge={acceptedChallenge} />,
    { noWrappers: true },
  ).snapshot();
});

it('render active and joined and completed challenge item', () => {
  renderWithContext(
    <ChallengeItem {...props} acceptedChallenge={completedChallenge} />,
    { noWrappers: true },
  ).snapshot();
});

it('render past challenge item', () => {
  renderWithContext(
    <ChallengeItem
      {...props}
      item={{
        ...item,
        isPast: true,
        end_date: moment('2018-09-10')
          .utc()
          .endOf('day')
          .toDate()
          .toString(),
      }}
    />,
    { noWrappers: true },
  ).snapshot();
});

it('render past and joined challenge item', () => {
  renderWithContext(
    <ChallengeItem
      {...props}
      item={{ ...item, isPast: true }}
      acceptedChallenge={acceptedChallenge}
    />,
    { noWrappers: true },
  ).snapshot();
});

it('render past and joined and completed challenge item', () => {
  renderWithContext(
    <ChallengeItem
      {...props}
      item={{ ...item, isPast: true }}
      acceptedChallenge={completedChallenge}
    />,
    { noWrappers: true },
  ).snapshot();
});

it('should call onComplete from press', () => {
  const { getByTestId } = renderWithContext(
    <ChallengeItem {...props} acceptedChallenge={acceptedChallenge} />,
    { noWrappers: true },
  );

  fireEvent.press(getByTestId('ChallengeItemActionButton'));

  expect(props.onComplete).toHaveBeenCalledWith(item);
});

it('should call onJoin from press', () => {
  const { getByTestId } = renderWithContext(<ChallengeItem {...props} />, {
    noWrappers: true,
  });

  fireEvent.press(getByTestId('ChallengeItemActionButton'));

  expect(props.onJoin).toHaveBeenCalledWith(item);
});

it('should call onSelect from press', () => {
  const { getByTestId } = renderWithContext(<ChallengeItem {...props} />, {
    noWrappers: true,
  });

  fireEvent.press(getByTestId('ChallengeItemSelectButton'));

  expect(props.onSelect).toHaveBeenCalledWith(item);
});
