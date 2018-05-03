import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import { testSnapshotShallow } from '../testUtils';
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
    <PeopleList sections={false} items={orgs} onSelect={() => {}} />
  );
});

it('renders correctly as Jean', () => {
  testSnapshotShallow(
    <PeopleList sections={true} items={orgs} onSelect={() => {}} />
  );
});
