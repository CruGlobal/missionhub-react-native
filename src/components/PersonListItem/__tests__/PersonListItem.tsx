import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';

import PersonListItem from '..';

const organization = { id: '1', name: 'Test Org' };
const person = {
  id: '123',
  first_name: 'First',
  last_name: 'Last',
  reverse_contact_assignments: [{ organization }],
};
const initialState = { auth: { person: {} } };

it('render assigned contact', () => {
  renderWithContext(
    <PersonListItem
      onSelect={jest.fn()}
      organization={organization}
      person={person}
    />,
    { initialState },
  ).snapshot();
});

it('render unassigned contact', () => {
  renderWithContext(
    <PersonListItem
      onSelect={jest.fn()}
      organization={organization}
      person={{ ...person, reverse_contact_assignments: [] }}
    />,
    { initialState },
  ).snapshot();
});

it('render without touchable', () => {
  renderWithContext(
    <PersonListItem
      organization={organization}
      person={{ ...person, reverse_contact_assignments: [] }}
    />,
    { initialState },
  ).snapshot();
});

it('render without last name', () => {
  renderWithContext(
    <PersonListItem
      organization={organization}
      person={{ ...person, last_name: undefined }}
    />,
    { initialState },
  ).snapshot();
});

it('calls onSelect prop', () => {
  const onSelect = jest.fn();

  const { getByTestId } = renderWithContext(
    <PersonListItem
      onSelect={onSelect}
      organization={organization}
      person={person}
    />,
    { initialState },
  );

  fireEvent.press(getByTestId('PersonListItemButton'));

  expect(onSelect).toHaveBeenCalled();
});
