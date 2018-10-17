import React from 'react';

import { ChallengeDetailScreen } from '../../src/containers/ChallengeDetailScreen';
import {
  testSnapshotShallow,
  renderShallow,
  createMockStore,
} from '../../testUtils';
import { navigateBack } from '../../src/actions/navigation';

jest.mock('../../src/actions/navigation');

const date = '2018-09-22';
const joinedChallenge = { id: 'a1' };
const completedChallenge = { ...joinedChallenge, completed_at: date };
const challenge = {
  id: '1',
  title: 'Read "There and Back Again"',
  end_date: date,
  isPast: false,
};

const unjoinedProps = {
  challenge,
  onComplete: jest.fn(),
  onJoin: jest.fn(),
  onEdit: jest.fn(),
  canEditChallenges: true,
  acceptedChallenge: undefined,
};
const joinedProps = {
  ...unjoinedProps,
  acceptedChallenge: joinedChallenge,
};
const completedProps = {
  ...unjoinedProps,
  acceptedChallenge: completedChallenge,
};

const store = createMockStore();

it('should render unjoined challenge correctly', () => {
  testSnapshotShallow(<ChallengeDetailScreen {...unjoinedProps} />, store);
});

it('should render joined challenge correctly', () => {
  testSnapshotShallow(<ChallengeDetailScreen {...joinedProps} />, store);
});

it('should render completed challenge correctly', () => {
  testSnapshotShallow(<ChallengeDetailScreen {...completedProps} />, store);
});

it('should call onJoin from press', () => {
  const component = renderShallow(
    <ChallengeDetailScreen {...unjoinedProps} />,
    store,
  );
  component
    .find('Connect(Header)')
    .props()
    .right.props.onPress();

  expect(unjoinedProps.onJoin).toHaveBeenCalledWith(challenge);
});

it('should call onComplete from press', () => {
  const component = renderShallow(
    <ChallengeDetailScreen {...joinedProps} />,
    store,
  );
  component
    .find('Connect(Header)')
    .props()
    .right.props.onPress();

  expect(joinedProps.onComplete).toHaveBeenCalledWith(challenge);
});

it('should call navigateBack from press', () => {
  const component = renderShallow(
    <ChallengeDetailScreen {...joinedProps} dispatch={jest.fn()} />,
    store,
  );
  component
    .find('Connect(Header)')
    .props()
    .left.props.onPress();

  expect(navigateBack).toHaveBeenCalled();
});
