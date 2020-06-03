import React from 'react';

import { renderWithContext } from '../../../../testUtils';
import { personSelector } from '../../../selectors/people';
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { AVATAR_FRAGMENT } from '../queries';
import { Avatar as AvatarFragment } from '../__generated__/Avatar';

import Avatar, { AvatarProps } from '..';

jest.mock('../../../selectors/people');

const person = mockFragment<AvatarFragment>(AVATAR_FRAGMENT, {
  mocks: { Person: () => ({ picture: null }) },
});
const personImage = mockFragment<AvatarFragment>(AVATAR_FRAGMENT);

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

it('renders person with custom text', () => {
  renders({ customText: '+5', person, size: 'small' });
});
