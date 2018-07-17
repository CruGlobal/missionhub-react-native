import React from 'react';
import uuidv4 from 'uuid/v4';

import GroupsPersonHeader from '../../src/components/GroupsPersonHeader/index';
import { testSnapshotShallow } from '../../testUtils/index';

jest.mock('uuid/v4');

beforeEach(() => {
  uuidv4.mockReturnValue('some key');
});

const person = {};
const organization = {};
const dispatch = jest.fn();
const myId = '1001';
const stages = [];

it('renders correctly for a member', () => {
  testSnapshotShallow(
    <GroupsPersonHeader
      isMember={true}
      person={person}
      organization={organization}
      dispatch={dispatch}
      myId={myId}
      stages={stages}
    />,
  );
});

it('renders correctly for a contact', () => {
  testSnapshotShallow(
    <GroupsPersonHeader
      isMember={false}
      person={person}
      organization={organization}
      dispatch={dispatch}
      myId={myId}
      stages={stages}
    />,
  );
});
