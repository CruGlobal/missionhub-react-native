import React from 'react';
import MockDate from 'mockdate';

import ChallengeItem from '../../src/components/ChallengeItem';
import { testSnapshotShallow, renderShallow } from '../../testUtils';
import { formatApiDate } from '../../src/utils/common';

jest.mock('../../src/actions/celebration');

MockDate.set('2018-09-15 12:00:00 PM');

const organization = { id: '456' };
const date = '2018-09-22T14:13:21Z';
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
  created_at: '2018-09-01T14:13:21Z',
};
const props = {
  onComplete: jest.fn(),
  onJoin: jest.fn(),
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
    <ChallengeItem {...props} item={{ ...item, accepted_at: date }} />,
  );
});

it('render active and joined challenge item with edit', () => {
  testSnapshotShallow(
    <ChallengeItem
      {...props}
      item={{ ...item, accepted_at: date }}
      onEdit={jest.fn()}
    />,
  );
});

it('render active and joined and completed challenge item', () => {
  testSnapshotShallow(
    <ChallengeItem
      {...props}
      item={{ ...item, accepted_at: date, completed_at: date }}
    />,
  );
});

it('render active and joined and completed challenge item', () => {
  testSnapshotShallow(
    <ChallengeItem
      {...props}
      item={{ ...item, accepted_at: date, completed_at: date }}
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
        end_date: formatApiDate('2018-09-10'),
      }}
    />,
  );
});

it('render past and active challenge item', () => {
  testSnapshotShallow(
    <ChallengeItem
      {...props}
      item={{ ...item, isPast: true, accepted_at: date }}
    />,
  );
});

it('render past and active and completed challenge item', () => {
  testSnapshotShallow(
    <ChallengeItem
      {...props}
      item={{ ...item, isPast: true, accepted_at: date, completed_at: date }}
    />,
  );
});

it('should call onEdit from press', () => {
  const newItem = { ...item, accepted_at: date };
  const newProps = {
    ...props,
    onEdit: jest.fn(),
  };
  const component = renderShallow(
    <ChallengeItem item={newItem} {...newProps} />,
  );

  component
    .childAt(0)
    .childAt(0)
    .childAt(1)
    .childAt(0)
    .childAt(0)
    .props()
    .onPress();
  expect(newProps.onEdit).toHaveBeenCalledWith(newItem);
});

it('should call onComplete from press', () => {
  const newItem = { ...item, accepted_at: date };
  const newProps = {
    ...props,
    onEdit: jest.fn(),
  };
  const component = renderShallow(
    <ChallengeItem item={newItem} {...newProps} />,
  );

  component
    .childAt(0)
    .childAt(1)
    .props()
    .onPress();
  expect(newProps.onComplete).toHaveBeenCalledWith(newItem);
});

it('should call onJoin from press', () => {
  const newProps = {
    ...props,
    onEdit: jest.fn(),
  };
  const component = renderShallow(<ChallengeItem item={item} {...newProps} />);

  component
    .childAt(1)
    .props()
    .onPress();
  expect(newProps.onJoin).toHaveBeenCalledWith(item);
});
