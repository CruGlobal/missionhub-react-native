import React from 'react';

import { renderWithContext } from '../../../../testUtils';
import { personSelector } from '../../../selectors/people';

import Avatar, { AvatarProps } from '..';

jest.mock('../../../selectors/people');

const person = { id: '123', full_name: 'Person One' };
const personImage = { ...person, picture: '123' };

beforeEach(() => {
  ((personSelector as unknown) as jest.Mock).mockReturnValue(person);
});

function renders(props: AvatarProps) {
  renderWithContext(<Avatar {...props} />, {
    noWrappers: true,
  }).snapshot();
}

it('renders text extrasmall', () => {
  renders({ person, size: 'extrasmall' });
});

it('renders text small', () => {
  renders({ person, size: 'small' });
});

it('renders text medium', () => {
  renders({ person, size: 'medium' });
});

it('renders text large', () => {
  renders({ person, size: 'large' });
});

it('renders image small', () => {
  renders({ person: personImage, size: 'small' });
});

it('renders image extrasmall', () => {
  renders({ person: personImage, size: 'extrasmall' });
});

it('renders image medium', () => {
  renders({ person: personImage, size: 'medium' });
});

it('renders image large', () => {
  renders({ person: personImage, size: 'large' });
});

it('renders person firstName', () => {
  renders({ person: { id: '123', firstName: 'test' }, size: 'small' });
});

it('renders person first_name', () => {
  renders({ person: { id: '123', first_name: 'test' }, size: 'small' });
});

it('renders person fullName', () => {
  renders({ person: { id: '123', fullName: 'test' }, size: 'small' });
});

it('renders person full_name', () => {
  renders({ person: { id: '123', full_name: 'test' }, size: 'small' });
});

it('renders person without name', () => {
  renders({ person: { id: '123' }, size: 'small' });
});

describe('lookup person by id', () => {
  const initialState = {
    people: { allByOrg: { personal: { people: { [person.id]: person } } } },
  };
  it('renders person lookup by id', () => {
    renderWithContext(<Avatar personId={person.id} size="small" />, {
      initialState,
    }).snapshot();
  });
  it('renders empty when cant find person', () => {
    ((personSelector as unknown) as jest.Mock).mockReturnValue(undefined);
    renderWithContext(<Avatar personId={'noperson'} size="small" />, {
      initialState,
    }).snapshot();
  });
});
