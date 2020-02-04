import React from 'react';

import { renderWithContext } from '../../../../testUtils';
import { Person } from '../../../reducers/people';
import { Organization } from '../../../reducers/organizations';

import MemberCelebrate from '..';

jest.mock('../../Analytics', () => 'Analytics');
jest.mock('../../CelebrateFeed', () => 'CelebrateFeed');

const person: Person = { id: '1' };
const organization: Organization = { id: '123' };

const initialState = { organizations: { all: [organization] } };

describe('MemberCelebrate', () => {
  it('renders correctly', () => {
    renderWithContext(
      <MemberCelebrate person={person} organization={organization} />,
      {
        initialState,
      },
    ).snapshot();
  });
});
