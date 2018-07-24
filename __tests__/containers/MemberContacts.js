import React from 'react';

import MemberContacts from '../../src/containers/MemberContacts';
import { testSnapshotShallow, renderShallow } from '../../testUtils';

const contactAssignment = { id: '1', person: {} };
const contactAssignmentNoPerson = { id: '2', person: null };
const personNoContactAssignments = {
  id: '1',
  first_name: 'Roge',
  contact_assignments: [],
};
const personWithContactAssignments = {
  ...personNoContactAssignments,
  contact_assignments: [contactAssignment, contactAssignmentNoPerson],
};
const organization = {
  id: '100',
  name: "Roge's org",
};

const props = {
  organization,
};

it('renders empty', () => {
  testSnapshotShallow(
    <MemberContacts {...props} person={personNoContactAssignments} />,
  );
});

it('renders a list', () => {
  testSnapshotShallow(
    <MemberContacts {...props} person={personWithContactAssignments} />,
  );
});

it('renders an item', () => {
  const screen = renderShallow(
    <MemberContacts {...props} person={personWithContactAssignments} />,
  );

  expect(
    screen.props().renderItem({ item: contactAssignment }),
  ).toMatchSnapshot();
});
