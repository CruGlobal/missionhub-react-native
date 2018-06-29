import React from 'react';

import { renderShallow, testSnapshotShallow } from '../../testUtils';
import ContactItem from '../../src/components/ContactItem';

const contact = {
  id: '123',
  full_name: 'Full Name',
  isAssigned: true,
};
const organization = { id: '1', name: 'Test Org' };

it('render assigned contact', () => {
  testSnapshotShallow(
    <ContactItem
      onSelect={jest.fn()}
      organization={organization}
      contact={contact}
    />,
  );
});

it('render unassigned contact', () => {
  testSnapshotShallow(
    <ContactItem
      onSelect={jest.fn()}
      organization={organization}
      contact={{ ...contact, isAssigned: false }}
    />,
  );
});

it('calls onSelect prop', () => {
  const onSelect = jest.fn();

  renderShallow(
    <ContactItem
      onSelect={onSelect}
      organization={organization}
      contact={contact}
    />,
  )
    .instance()
    .handleSelect();

  expect(onSelect).toHaveBeenCalled();
});
