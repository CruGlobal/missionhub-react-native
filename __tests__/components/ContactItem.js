import React from 'react';

import { renderShallow, testSnapshotShallow } from '../../testUtils';
import ContactItem from '../../src/components/ContactItem';

const organization = { id: '1', name: 'Test Org' };
const contact = {
  id: '123',
  full_name: 'Full Name',
  reverse_contact_assignments: [{ organization }],
};

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
      contact={{ ...contact, reverse_contact_assignments: [] }}
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
