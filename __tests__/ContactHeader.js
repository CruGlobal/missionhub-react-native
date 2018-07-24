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

const person = {
  first_name: 'ben',
  id: '1',
  email_addresses: [],
  phone_numbers: [],
};
const organization = { name: 'Test Org', id: '10' };

jest.mock('NativeAnimatedHelper');

it('renders casey', () => {
  testContactHeader(CASEY);
});

it('renders jean', () => {
  testContactHeader(JEAN, false, organization);
});

it('renders me', () => {
  testContactHeader(JEAN, true);
});

it('renders jean with a missionhub user as contact', () => {
  testContactHeader(JEAN, false, organization, true);
});

const testContactHeader = (
  type,
  isMe = false,
  useOrganization,
  isMissionhubUser = false,
) => {
  testSnapshotShallow(
    <ContactHeader
      isMe={isMe}
      person={person}
      organization={useOrganization}
      isMissionhubUser={isMissionhubUser}
      type={type}
      onChangeStage={() => {}}
    />,
    store,
  );
};
