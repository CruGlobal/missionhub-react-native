import React from 'react';

import ChallengeDetailHeader from '../../../components/ChallengeDetailHeader';
import { testSnapshotShallow, renderShallow } from '../../../../testUtils';

const endDate = '2018-09-22';

const activeChallenge = {
  isPast: false,
  title: 'Challenge Title',
  end_date: endDate,
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
  testSnapshotShallow(<ChallengeDetailHeader {...props} />);
});

it('render for active challenge with edit', () => {
  testSnapshotShallow(
    <ChallengeDetailHeader {...{ ...props, canEditChallenges: true }} />,
  );
});

it('render for past challenge', () => {
  testSnapshotShallow(
    <ChallengeDetailHeader
      {...{
        ...props,
        canEditChallenges: true,
        challenge: pastChallenge,
      }}
    />,
  );
});

it('should call onEdit from press', () => {
  const component = renderShallow(
    <ChallengeDetailHeader {...{ ...props, canEditChallenges: true }} />,
  );

  component
    .childAt(0)
    .childAt(0)
    .childAt(0)
    .childAt(0)
    .props()
    .onPress();
  expect(props.onEdit).toHaveBeenCalledWith(activeChallenge);
});
