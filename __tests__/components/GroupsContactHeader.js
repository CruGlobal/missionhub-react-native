import React from 'react';
import uuidv4 from 'uuid/v4';

import GroupsContactHeader from '../../src/components/GroupsContactHeader/index';
import { testSnapshotShallow } from '../../testUtils/index';

jest.mock('uuid/v4');

beforeEach(() => {
  uuidv4.mockReturnValue('some key');
});

it('renders correctly for a member', () => {
  testSnapshotShallow(<GroupsContactHeader isMember={true} />);
});

it('renders correctly for a contact', () => {
  testSnapshotShallow(<GroupsContactHeader isMember={false} />);
});
