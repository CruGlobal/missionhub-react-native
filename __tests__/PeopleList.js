import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import { renderShallow, testSnapshotShallow } from '../testUtils';
import PeopleList from '../src/components/PeopleList';

const orgs = [
  {
    id: 'personal',
    type: 'organization',
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
    id: 10,
    name: 'org 1',
    type: 'organization',
    people: [
      {
        id: 11,
        type: 'person',
      },
    ],
  },
  {
    id: 20,
    name: 'org 2',
    type: 'organization',
    people: [
      {
        id: 21,
        type: 'person',
      },
    ],
  },
];

it('renders correctly as Casey', () => {
  testSnapshotShallow(
    <PeopleList sections={false} items={orgs} onSelect={jest.fn()} />,
  );
});

it('renders correctly as Jean', () => {
  testSnapshotShallow(
    <PeopleList sections={true} items={orgs} onSelect={jest.fn()} />,
  );
});

describe('button presses', () => {
  let component;
  let componentInstance;

  beforeEach(() => {
    component = renderShallow(
      <PeopleList
        sections={true}
        items={orgs}
        onSelect={jest.fn()}
        onAddContact={jest.fn()}
      />,
    );

    componentInstance = component.instance();

    componentInstance.toggleSection = jest.fn();
  });

  it('onAddContact is called when add contact icon is pressed', () => {
    const addContactButton = component.find({ name: 'addContactIcon' }).first();
    addContactButton.simulate('press');

    expect(componentInstance.props.onAddContact).toHaveBeenCalledWith(
      undefined,
    );
  });

  it('toggleSection is called when arrow icon is pressed', () => {
    const arrowButton = component.find({ name: 'upArrowIcon' }).first();
    arrowButton.simulate('press');

    expect(componentInstance.toggleSection).toHaveBeenCalledWith('personal');
  });
});
