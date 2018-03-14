import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import ContactHeader from '../src/components/ContactHeader';
import { testSnapshotShallow } from '../testUtils';
import { createMockStore } from '../testUtils/index';
import { CASEY, JEAN } from '../src/constants';

const mockState = {
  steps: {
    mine: [],
  },
  swipe: {
    stepsContact: true,
  },
  auth: {},
  profile: {
    visiblePersonInfo: {
      contactAssignmentId: '333',
    },
  },
};

const store = createMockStore(mockState);

const person = { first_name: 'ben', id: '1', email_addresses: [], phone_numbers: [] };
const organization = { name: 'Test Org', id: '10' };

jest.mock('NativeAnimatedHelper');

it('renders casey', () => {
  testContactHeader(person, CASEY);
});

it('renders jean', () => {
  testContactHeader(person, JEAN, false, organization);
});

it('renders me', () => {
  testContactHeader(person, JEAN, true);
});

it('renders jean with a missionhub user as contact', () => {
  testContactHeader({ ...person }, JEAN, false, organization, { permission_id: 1 });
});

const testContactHeader = (person, type, isMe = false, organization, orgPermission) => {
  testSnapshotShallow(
    <ContactHeader isMe={isMe} person={person} organization={organization} orgPermission={orgPermission} type={type} onChangeStage={() => {}} />,
    store
  );
};
