import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import { Provider } from 'react-redux';
import { createMockStore, testSnapshot } from '../../testUtils';
import PeopleItem from '../../src/containers/PeopleItem';

jest.mock('../../src/actions/people', () => ({
  getMyPeople: () => () => 'test',
}));

const mockState = {
  auth: {
    user: {
      id: '1',
      stage: { id: '1', name: 'Stage 1' },
    },
  },
  stages: {
    stagesObj: {},
  },
};

const store = createMockStore(mockState);

jest.mock('react-native-device-info');


const mockPerson = {
  id: '123',
  first_name: 'John',
  last_name: 'Doe',
  full_name: 'John Doe',
  gender: 'Female',
  student_status: null,
  campus: null,
  year_in_school: null,
  major: null,
  minor: null,
  birth_date: null,
  date_became_christian: null,
  graduation_date: null,
  picture: 'https://graph.facebook.com/v2.5/0/picture',
  fb_uid: 0,
  created_at: '2017-12-05T15:13:10Z',
  updated_at: '2017-12-05T15:13:10Z',
  organizational_permissions: [
    { organization_id: '1', followup_status: 'uncontacted' },
  ],
  reverse_contact_assignments: [
    { assigned_to: { id: '1' }, pathway_stage_id: '1' },
  ],
};


it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <PeopleItem onSelect={() => {}} person={mockPerson} />
    </Provider>
  );
});

it('renders personal user correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <PeopleItem onSelect={() => {}} person={mockPerson} organization={{ id: 'personal' }} />
    </Provider>
  );
});

it('renders org user correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <PeopleItem onSelect={() => {}} person={mockPerson} organization={{ id: '1' }} />
    </Provider>
  );
});

it('renders permission user correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <PeopleItem
        onSelect={() => {}}
        person={{
          ...mockPerson,
          organizational_permissions: [
            { organization_id: '1', followup_status: 'uncontacted', permission_id: 1 },
          ],
        }}
        organization={{ id: '1' }} />
    </Provider>
  );
});
