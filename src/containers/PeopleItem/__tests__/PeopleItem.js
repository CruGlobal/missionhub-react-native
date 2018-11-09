import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';

import {
  createMockStore,
  renderShallow,
  testSnapshot,
} from '../../../../testUtils';

import PeopleItem from '..';

import { navigatePush } from '../../../actions/navigation';
import { PERSON_STAGE_SCREEN } from '../../PersonStageScreen';
import { orgIsCru, isMissionhubUser } from '../../../utils/common';

const myId = '1';
const stageId = '1';

const mockStages = {
  [stageId]: {
    id: stageId,
    name: 'Stage 1',
  },
};

const mockState = {
  auth: {
    person: {
      id: myId,
      stage: mockStages[stageId],
    },
  },
  stages: {
    stagesObj: mockStages,
  },
};

const store = createMockStore(mockState);

const onSelect = jest.fn();

const mockPersonalMinistry = { id: 'personal' };
const mockOrganization = { id: '1', user_created: false };

const mockOrgPermission = {
  organization_id: mockOrganization.id,
  followup_status: 'contacted',
};
const mockOrgPermissionUncontacted = {
  organization_id: mockOrganization.id,
  followup_status: 'uncontacted',
};
const mockContactAssignment = {
  id: '90',
  assigned_to: { id: myId },
  pathway_stage_id: '1',
};
const mockContactAssignmentNoStage = {
  id: '90',
  assigned_to: { id: myId },
};
const mockPerson = {
  id: '123',
  first_name: 'John',
  last_name: 'Doe',
  full_name: 'John Doe',
  organizational_permissions: [mockOrgPermission],
  reverse_contact_assignments: [mockContactAssignment],
};

const mockNavigatePushResult = { type: 'navigated' };
const mockGetPeopleResult = { type: 'got people' };

let shallowScreen;

jest.mock('../../../actions/people', () => ({
  getMyPeople: () => mockGetPeopleResult,
}));
jest.mock('../../../actions/navigation', () => ({
  navigatePush: jest.fn((_, params) => {
    params.onComplete();
    return mockNavigatePushResult;
  }),
}));
jest.mock('../../../utils/common');

beforeEach(() => {
  jest.clearAllMocks();
});

it('renders me correctly', () => {
  const mePerson = { ...mockPerson, id: myId };

  orgIsCru.mockReturnValue(false);
  isMissionhubUser.mockReturnValue(false);

  testSnapshot(
    <Provider store={store}>
      <PeopleItem
        onSelect={onSelect}
        person={mePerson}
        organization={mockPersonalMinistry}
      />
    </Provider>,
  );
  expect(orgIsCru).toHaveBeenCalledWith(mockPersonalMinistry);
  expect(isMissionhubUser).not.toHaveBeenCalled();
});

it('renders personal ministry contact correctly', () => {
  orgIsCru.mockReturnValue(false);
  isMissionhubUser.mockReturnValue(false);

  testSnapshot(
    <Provider store={store}>
      <PeopleItem
        onSelect={onSelect}
        person={mockPerson}
        organization={mockPersonalMinistry}
      />
    </Provider>,
  );
  expect(orgIsCru).toHaveBeenCalledWith(mockPersonalMinistry);
  expect(isMissionhubUser).not.toHaveBeenCalled();
});

it('renders cru org contact correctly', () => {
  orgIsCru.mockReturnValue(true);
  isMissionhubUser.mockReturnValue(false);

  testSnapshot(
    <Provider store={store}>
      <PeopleItem
        onSelect={onSelect}
        person={mockPerson}
        organization={mockOrganization}
      />
    </Provider>,
  );
  expect(orgIsCru).toHaveBeenCalledWith(mockOrganization);
  expect(isMissionhubUser).toHaveBeenCalledWith(mockOrgPermission);
});

it('renders cru org contact without stage correctly', () => {
  orgIsCru.mockReturnValue(true);
  isMissionhubUser.mockReturnValue(false);

  testSnapshot(
    <Provider store={store}>
      <PeopleItem
        onSelect={onSelect}
        person={{
          ...mockPerson,
          reverse_contact_assignments: [mockContactAssignmentNoStage],
        }}
        organization={mockOrganization}
      />
    </Provider>,
  );
  expect(orgIsCru).toHaveBeenCalledWith(mockOrganization);
  expect(isMissionhubUser).toHaveBeenCalledWith(mockOrgPermission);
});

it('renders uncontacted cru org contact correctly', () => {
  orgIsCru.mockReturnValue(true);
  isMissionhubUser.mockReturnValue(false);

  testSnapshot(
    <Provider store={store}>
      <PeopleItem
        onSelect={onSelect}
        person={{
          ...mockPerson,
          organizational_permissions: [mockOrgPermissionUncontacted],
        }}
        organization={mockOrganization}
      />
    </Provider>,
  );
  expect(orgIsCru).toHaveBeenCalledWith(mockOrganization);
  expect(isMissionhubUser).toHaveBeenCalledWith(mockOrgPermissionUncontacted);
});

it('renders cru org member correctly', () => {
  orgIsCru.mockReturnValue(true);
  isMissionhubUser.mockReturnValue(true);

  testSnapshot(
    <Provider store={store}>
      <PeopleItem
        onSelect={jest.fn()}
        person={mockPerson}
        organization={mockOrganization}
      />
    </Provider>,
  );
  expect(orgIsCru).toHaveBeenCalledWith(mockOrganization);
  expect(isMissionhubUser).toHaveBeenCalledWith(mockOrgPermission);
});

describe('handleChangeStage', () => {
  it('navigates to person stage screen', () => {
    shallowScreen = renderShallow(
      <PeopleItem
        onSelect={onSelect}
        person={{
          ...mockPerson,
          reverse_contact_assignments: [mockContactAssignmentNoStage],
        }}
        organization={mockOrganization}
      />,
      store,
    );

    shallowScreen
      .childAt(0)
      .childAt(1)
      .props()
      .onPress();

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
    shallowScreen = renderShallow(
      <PeopleItem
        onSelect={onSelect}
        person={mockPerson}
        organization={mockOrganization}
      />,
      store,
    );

    shallowScreen.props().onPress();

    expect(onSelect).toHaveBeenCalledWith(mockPerson, mockOrganization);
  });
});
