import React from 'react';
import { LayoutAnimation } from 'react-native';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';

import PeopleList from '..';

jest.mock('../../../containers/PersonItem', () => 'PersonItem');
jest.mock('../../IconButton', () => 'IconButton');
jest.mock('../../common', () => ({
  Flex: 'Flex',
  Text: 'Text',
  RefreshControl: 'RefreshControl',
}));

LayoutAnimation.configureNext = jest.fn();

const orgs = [
  {
    id: 'personal',
    type: 'organization',
    expanded: false,
    people: [
      {
        id: 1,
        type: 'person',
      },
      {
        id: 2,
        type: 'person',
      },
      {
        id: 3,
        type: 'person',
      },
    ],
  },
  {
    id: '10',
    name: 'org 1',
    type: 'organization',
    expanded: false,
    people: [
      {
        id: 11,
        type: 'person',
      },
    ],
    user_created: false,
  },
  {
    id: '20',
    name: 'org 2',
    type: 'organization',
    expanded: false,
    people: [
      {
        id: '21',
        type: 'person',
      },
    ],
    user_created: true,
  },
];

const people = [
  {
    id: '1',
    type: 'person',
  },
  {
    id: '2',
    type: 'person',
  },
  {
    id: '3',
    type: 'person',
  },
];

const props = {
  onSelect: jest.fn(),
  onAddContact: jest.fn(),
  refreshing: false,
  onRefresh: jest.fn(),
};

it('renders correctly as Casey', () => {
  renderWithContext(
    <PeopleList {...props} sections={false} items={people} />,
  ).snapshot();
});

it('renders correctly as Jean', () => {
  renderWithContext(
    <PeopleList {...props} sections={true} items={orgs} />,
  ).snapshot();
});

describe('button presses', () => {
  it('onAddContact is called when add contact icon is pressed', () => {
    const { getAllByTestId } = renderWithContext(
      <PeopleList {...props} sections={true} items={orgs} />,
    );

    fireEvent.press(getAllByTestId('addContactBtn')[0]);

    expect(props.onAddContact).toHaveBeenCalledWith(undefined);
  });

  it('arrow icon toggles collapsed sections', () => {
    const { recordSnapshot, getAllByTestId, diffSnapshot } = renderWithContext(
      <PeopleList {...props} sections={true} items={orgs} />,
    );

    recordSnapshot();
    const toggleSectionBtn = getAllByTestId('toggleSectionBtn')[0];
    fireEvent(toggleSectionBtn, 'press', toggleSectionBtn.props.pressProps[0]);
    diffSnapshot();
  });
});
