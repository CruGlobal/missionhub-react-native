import React from 'react';
import MockDate from 'mockdate';
import moment from 'moment';

import ChallengeItem from '../../src/components/ChallengeItem';
import { testSnapshotShallow, renderShallow } from '../../testUtils';

jest.mock('../../src/actions/celebration');

MockDate.set(
  moment('2018-09-15')
    .endOf('day')
    .toDate(),
);

const organization = { id: '456' };
const date = '2018-09-22';
const acceptedChallenge = { id: 'a1' };
const completedChallenge = { ...acceptedChallenge, completed_at: date };
const item = {
  id: '1',
  creator_id: 'person1',
  organization_id: organization.id,
  title: 'Read "There and Back Again"',
  end_date: date,
  accepted_count: 5,
  completed_count: 3,
  days_remaining: 14,
  isPast: false,
  created_at: '2018-09-01T12:00:00Z',
};
const props = {
  onComplete: jest.fn(),
  onJoin: jest.fn(),
  onSelect: jest.fn(),
};

it('render active challenge item', () => {
  testSnapshotShallow(<ChallengeItem {...props} item={item} />);
});

it('render active challenge item with edit', () => {
  testSnapshotShallow(
    <ChallengeItem {...props} item={item} onEdit={jest.fn()} />,
  );
});

it('render active and joined challenge item', () => {
  testSnapshotShallow(
    <ChallengeItem
      {...props}
      item={item}
      acceptedChallenge={acceptedChallenge}
    />,
  );
});

it('render active and joined challenge item with edit', () => {
  testSnapshotShallow(
    <ChallengeItem
      {...props}
      item={item}
      acceptedChallenge={acceptedChallenge}
      onEdit={jest.fn()}
    />,
  );
});

it('render active and joined and completed challenge item', () => {
  testSnapshotShallow(
    <ChallengeItem
      {...props}
      item={item}
      acceptedChallenge={completedChallenge}
    />,
  );
});

it('render past challenge item', () => {
  testSnapshotShallow(
    <ChallengeItem
      {...props}
      item={{
        ...item,
        isPast: true,
        end_date: moment('2018-09-10').endOf('day'),
      }}
    />,
  );
});

it('render past and joined challenge item', () => {
  testSnapshotShallow(
    <ChallengeItem
      {...props}
      item={{ ...item, isPast: true }}
      acceptedChallenge={acceptedChallenge}
    />,
  );
});

it('render past and joined and completed challenge item', () => {
  testSnapshotShallow(
    <ChallengeItem
      {...props}
      item={{ ...item, isPast: true }}
      acceptedChallenge={completedChallenge}
    />,
  );
});

it('should call onEdit from press', () => {
  const newProps = {
    ...props,
    onEdit: jest.fn(),
  };
  const component = renderShallow(
    <ChallengeItem
      item={item}
      {...newProps}
      acceptedChallenge={acceptedChallenge}
    />,
  );

  component
    .childAt(0)
    .childAt(0)
    .childAt(0)
    .childAt(1)
    .childAt(0)
    .childAt(0)
    .props()
    .onPress();
  expect(newProps.onEdit).toHaveBeenCalledWith(item);
});

it('should call onComplete from press', () => {
  const component = renderShallow(
    <ChallengeItem
      item={item}
      {...props}
      acceptedChallenge={acceptedChallenge}
    />,
  );

  component
    .childAt(1)
    .props()
    .onPress();
  expect(props.onComplete).toHaveBeenCalledWith(item);
});

it('should call onJoin from press', () => {
  const component = renderShallow(<ChallengeItem item={item} {...props} />);

  component
    .childAt(1)
    .props()
    .onPress();
  expect(props.onJoin).toHaveBeenCalledWith(item);
});

it('should call onSelect from press', () => {
  const component = renderShallow(<ChallengeItem item={item} {...props} />);

  component
    .childAt(0)
    .props()
    .onPress();
  expect(props.onSelect).toHaveBeenCalledWith(item);
});
