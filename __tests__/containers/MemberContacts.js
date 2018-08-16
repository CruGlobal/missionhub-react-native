import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import MemberContacts from '../../src/containers/MemberContacts';
import { testSnapshotShallow, renderShallow } from '../../testUtils';

const contactAssignment = { id: '1', person: {}, organization: { id: '100' } };
const contactAssignmentDifferentOrg = {
  id: '2',
  person: {},
  organization: { id: '105x' },
}; /* should not be rendered */
const contactAssignmentNoPerson = { id: '2', person: null };
const personNoContactAssignments = {
  id: '1',
  first_name: 'Roge',
  contact_assignments: [],
};
const personWithContactAssignments = {
  ...personNoContactAssignments,
  contact_assignments: [
    contactAssignment,
    contactAssignmentNoPerson,
    contactAssignmentDifferentOrg,
  ],
};
const organization = {
  id: '100',
  name: "Roge's org",
};

const mockState = {
  organizations: {
    all: [organization],
  },
  people: {
    allByOrg: {
      [organization.id]: {
        people: {
          [personWithContactAssignments.id]: personWithContactAssignments,
        },
      },
    },
  },
};

const mockStore = configureStore([thunk]);
const store = mockStore(mockState);

const props = {
  organization,
};

it('renders empty', () => {
  testSnapshotShallow(
    <MemberContacts
      {...props}
      store={store}
      person={{ ...personNoContactAssignments, id: '2' }}
    />,
  );
});

it('renders a list', () => {
  testSnapshotShallow(
    <MemberContacts
      {...props}
      store={store}
      person={personWithContactAssignments}
    />,
  );
});

it('renders an item', () => {
  const screen = renderShallow(
    <MemberContacts
      {...props}
      store={store}
      person={personWithContactAssignments}
    />,
  );

  expect(
    screen.props().renderItem({ item: contactAssignment }),
  ).toMatchSnapshot();
});
