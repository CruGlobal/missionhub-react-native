import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import { Provider } from 'react-redux';

import { createMockStore, renderShallow, testSnapshot } from '../../testUtils';
import PeopleItem from '../../src/containers/PeopleItem';
import { navigatePush } from '../../src/actions/navigation';
import { PERSON_STAGE_SCREEN } from '../../src/containers/PersonStageScreen';

const mockState = {
  auth: {
    person: {
      id: '1',
      stage: { id: '1', name: 'Stage 1' },
    },
  },
  stages: {
    stagesObj: {},
  },
};

const store = createMockStore(mockState);

const onSelect = jest.fn();

const mockOrganization = { id: '1' };
const mockContactAssignment = { id: '90', assigned_to: { id: '1' }, pathway_stage_id: '1' };
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
    { organization_id: mockOrganization.id, followup_status: 'uncontacted' },
  ],
  reverse_contact_assignments: [ mockContactAssignment ],
};

const mockNavigatePushResult = { type: 'navigated' };
const mockGetPeopleResult = { type: 'got people' };

let shallowScreen;

jest.mock('react-native-device-info');
jest.mock('../../src/actions/people', () => ({
  getMyPeople: () => mockGetPeopleResult,
}));
jest.mock('../../src/actions/navigation', () => ({
  navigatePush: jest.fn((_, params) => {
    params.onComplete();
    return mockNavigatePushResult;
  }),
}));

beforeEach(() => shallowScreen = renderShallow(<PeopleItem onSelect={onSelect} person={mockPerson} organization={mockOrganization} />, store));

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <PeopleItem onSelect={onSelect} person={mockPerson} />
    </Provider>
  );
});

it('renders personal user correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <PeopleItem onSelect={onSelect} person={mockPerson} organization={{ id: 'personal' }} />
    </Provider>
  );
});

it('renders org user correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <PeopleItem onSelect={onSelect} person={mockPerson} organization={mockOrganization} />
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
            { organization_id: mockOrganization.id, followup_status: 'uncontacted', permission_id: 1 },
          ],
        }}
        organization={mockOrganization} />
    </Provider>
  );
});

describe('handleChangeStage', () => {
  it('navigates to person stage screen', () => {
    shallowScreen.childAt(0).childAt(1).props().onPress();

    expect(store.dispatch).toHaveBeenCalledWith(mockGetPeopleResult);
    expect(navigatePush).toHaveBeenCalledWith(PERSON_STAGE_SCREEN, {
      onComplete: expect.anything(),
      currentStage: null,
      name: mockPerson.first_name,
      contactId: mockPerson.id,
      contactAssignmentId: mockContactAssignment.id,
      section: 'people',
      subsection: 'person',
      orgId: mockOrganization.id,
    });
    expect(store.dispatch).toHaveBeenCalledWith(mockNavigatePushResult);
  });
});

describe('item selected', () => {
  it('calls onSelect', () => {
    shallowScreen.props().onPress();

    expect(onSelect).toHaveBeenCalledWith(mockPerson, mockOrganization);
  });
});
