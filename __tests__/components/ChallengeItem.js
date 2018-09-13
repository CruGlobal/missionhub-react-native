import React from 'react';

import ChallengeItem from '../../src/components/ChallengeItem';
import { testSnapshotShallow, renderShallow } from '../../testUtils';

jest.mock('../../src/actions/celebration');

const organization = { id: '456' };
const date = '2018-09-06T14:13:21Z';
const item = {
  id: '1',
  creator_id: 'person1',
  organization_id: organization.id,
  title: 'Read "There and Back Again"',
  end_date: date,
  accepted: 5,
  completed: 3,
  days_remaining: 14,
  isPast: false,
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
    <ChallengeItem {...props} item={{ ...item, isPast: true }} />,
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

it('should call methods', () => {
  const newProps = { ...props, onEdit: jest.fn() };
  const instance = renderShallow(
    <ChallengeItem item={item} {...newProps} />,
  ).instance();

  instance.handleEdit();
  expect(newProps.onEdit).toHaveBeenCalledWith(item);
  instance.handleJoin();
  expect(newProps.onJoin).toHaveBeenCalledWith(item);
  instance.handleComplete();
  expect(newProps.onComplete).toHaveBeenCalledWith(item);
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
