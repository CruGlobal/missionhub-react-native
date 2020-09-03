import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import PersonListItem from '..';
import { getAuthPerson } from '../../../auth/authUtilities';

jest.mock('../../../auth/authUtilities');
const myId = '1';
(getAuthPerson as jest.Mock).mockReturnValue({ id: myId });

const organization = { id: '1', name: 'Test Org' };
const person = {
  id: '123',
  first_name: 'First',
  last_name: 'Last',
  reverse_contact_assignments: [{ organization, assigned_to: { id: myId } }],
};

it('render assigned contact', () => {
  renderWithContext(
    <PersonListItem onSelect={jest.fn()} person={person} />,
  ).snapshot();
});

it('render unassigned contact', () => {
  renderWithContext(
    <PersonListItem
      onSelect={jest.fn()}
      person={{ ...person, reverse_contact_assignments: [] }}
    />,
  ).snapshot();
});

it('render without touchable', () => {
  renderWithContext(
    <PersonListItem person={{ ...person, reverse_contact_assignments: [] }} />,
  ).snapshot();
});

it('render without last name', () => {
  renderWithContext(
    <PersonListItem person={{ ...person, last_name: undefined }} />,
  ).snapshot();
});

it('calls onSelect prop', () => {
  const onSelect = jest.fn();

  const { getByTestId } = renderWithContext(
    <PersonListItem onSelect={onSelect} person={person} />,
  );

  fireEvent.press(getByTestId('PersonListItemButton'));

  expect(onSelect).toHaveBeenCalled();
});
