import React from 'react';

import { renderShallow, testSnapshotShallow } from '../../../../testUtils';

import PersonListItem from '..';

const organization = { id: '1', name: 'Test Org' };
const person = {
  id: '123',
  first_name: 'First',
  last_name: 'Last',
  reverse_contact_assignments: [{ organization }],
};

it('render assigned contact', () => {
  testSnapshotShallow(
    <PersonListItem
      onSelect={jest.fn()}
      organization={organization}
      person={person}
    />,
  );
});

it('render unassigned contact', () => {
  testSnapshotShallow(
    <PersonListItem
      onSelect={jest.fn()}
      organization={organization}
      person={{ ...person, reverse_contact_assignments: [] }}
    />,
  );
});

it('render without touchable', () => {
  testSnapshotShallow(
    <PersonListItem
      organization={organization}
      person={{ ...person, reverse_contact_assignments: [] }}
    />,
  );
});

it('render without last name', () => {
  testSnapshotShallow(
    <PersonListItem
      organization={organization}
      person={{ ...person, last_name: null }}
    />,
  );
});

it('calls onSelect prop', () => {
  const onSelect = jest.fn();

  renderShallow(
    <PersonListItem
      onSelect={onSelect}
      organization={organization}
      person={person}
    />,
  )
    .instance()
    .handleSelect();

  expect(onSelect).toHaveBeenCalled();
});
