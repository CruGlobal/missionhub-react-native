import React from 'react';
import MockDate from 'mockdate';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import ChallengeMemberItem from '..';

jest.mock('../../../auth/authStore', () => ({ isAuthenticated: () => true }));

const mockDate = '2020-02-29 12:00:00 PM GMT+0';
MockDate.set(mockDate);

const date = '2020-02-26';
const myId = '1234';
const item = {
  id: '1',
  title: 'Cool Challenge',
  accepted_at: date,
  end_date: '2020-03-01',
  accepted_count: 1,
  completed_count: 0,
  person: {
    id: myId,
    full_name: 'Christian Huffman',
  },
};
const onSelect = jest.fn();
const props = {
  date,
  onSelect,
  item,
};

const completedItem = {
  ...item,
  completed_at: '2020-02-27',
};

it('render correctly | Me', async () => {
  const { snapshot } = renderWithContext(<ChallengeMemberItem {...props} />, {
    mocks: { User: () => ({ person: () => ({ id: myId }) }) },
  });

  await flushMicrotasksQueue();

  snapshot();
});

it('renders correctly | Not Me', async () => {
  const { snapshot } = renderWithContext(<ChallengeMemberItem {...props} />, {
    mocks: { User: () => ({ person: () => ({ id: '4' }) }) },
  });

  await flushMicrotasksQueue();

  snapshot();
});

it('renders completed item correctly', async () => {
  const { snapshot } = renderWithContext(
    <ChallengeMemberItem
      item={completedItem}
      date={date}
      onSelect={onSelect}
    />,
    {
      mocks: { User: () => ({ person: () => ({ id: myId }) }) },
    },
  );

  await flushMicrotasksQueue();

  snapshot();
});

it('renders full date if not in same week', async () => {
  const dateItem = {
    ...item,
    accepted_at: '2020-02-22',
  };
  const { snapshot } = renderWithContext(
    <ChallengeMemberItem
      item={dateItem}
      date={'2020-02-22'}
      onSelect={onSelect}
    />,
    {
      mocks: { User: () => ({ person: () => ({ id: myId }) }) },
    },
  );

  await flushMicrotasksQueue();

  snapshot();
});

it('fires onSelect when item is pressed', async () => {
  const { getByTestId } = renderWithContext(
    <ChallengeMemberItem {...props} />,
    {
      mocks: { User: () => ({ person: () => ({ id: myId }) }) },
    },
  );

  await fireEvent.press(getByTestId('ChallengeMemberItemButton'));
  expect(onSelect).toHaveBeenCalledWith(item.person);
});
