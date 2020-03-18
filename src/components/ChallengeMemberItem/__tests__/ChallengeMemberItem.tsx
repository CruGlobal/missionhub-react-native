import React from 'react';
import MockDate from 'mockdate';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';

import ChallengeMemberItem from '..';

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
    first_name: 'Christian',
    last_name: 'Huffman',
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

it('render correctly | Me', () => {
  renderWithContext(<ChallengeMemberItem {...props} />, {
    initialState: {
      auth: {
        person: {
          id: myId,
        },
      },
    },
  }).snapshot();
});

it('renders correctly | Not Me', () => {
  renderWithContext(<ChallengeMemberItem {...props} />, {
    initialState: {
      auth: {
        person: {
          id: '4',
        },
      },
    },
  }).snapshot();
});

it('renders completed item correctly', () => {
  renderWithContext(
    <ChallengeMemberItem
      item={completedItem}
      date={date}
      onSelect={onSelect}
    />,
    {
      initialState: {
        auth: {
          person: {
            id: myId,
          },
        },
      },
    },
  ).snapshot();
});

it('renders full date if not in same week', () => {
  const dateItem = {
    ...item,
    accepted_at: '2020-02-22',
  };
  renderWithContext(
    <ChallengeMemberItem
      item={dateItem}
      date={'2020-02-22'}
      onSelect={onSelect}
    />,
    {
      initialState: {
        auth: {
          person: {
            id: myId,
          },
        },
      },
    },
  ).snapshot();
});

it('fires onSelect when item is pressed', async () => {
  const { getByTestId } = renderWithContext(
    <ChallengeMemberItem {...props} />,
    {
      initialState: {
        auth: {
          person: {
            id: myId,
          },
        },
      },
    },
  );

  await fireEvent.press(getByTestId('ChallengeMemberItemButton'));
  expect(onSelect).toHaveBeenCalledWith(item.person);
});
