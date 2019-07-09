import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';

import PersonItem from '..';

import { navigatePush } from '../../../actions/navigation';
import { orgIsCru, hasOrgPermissions } from '../../../utils/common';
import { SELECT_PERSON_STAGE_FLOW } from '../../../routes/constants';

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

jest.mock('../../../actions/navigation', () => ({
  navigatePush: jest.fn(() => mockNavigatePushResult),
}));
jest.mock('../../../utils/common');

it('renders me correctly', () => {
  const mePerson = { ...mockPerson, id: myId };

  (orgIsCru as jest.Mock).mockReturnValue(false);
  (hasOrgPermissions as jest.Mock).mockReturnValue(false);

  renderWithContext(
    <PersonItem
      onSelect={onSelect}
      person={(mePerson as unknown) as PersonAttributes}
      organization={mockPersonalMinistry}
    />,
    { initialState: mockState },
  ).snapshot();

  expect(orgIsCru).toHaveBeenCalledWith(mockPersonalMinistry);
  expect(hasOrgPermissions).not.toHaveBeenCalled();
});

it('renders personal ministry contact correctly', () => {
  (orgIsCru as jest.Mock).mockReturnValue(false);
  (hasOrgPermissions as jest.Mock).mockReturnValue(false);

  renderWithContext(
    <PersonItem
      onSelect={onSelect}
      person={(mockPerson as unknown) as PersonAttributes}
      organization={mockPersonalMinistry}
    />,
    { initialState: mockState },
  ).snapshot();

  expect(orgIsCru).toHaveBeenCalledWith(mockPersonalMinistry);
  expect(hasOrgPermissions).not.toHaveBeenCalled();
});

it('renders cru org contact correctly', () => {
  (orgIsCru as jest.Mock).mockReturnValue(true);
  (hasOrgPermissions as jest.Mock).mockReturnValue(false);

  renderWithContext(
    <PersonItem
      onSelect={onSelect}
      person={(mockPerson as unknown) as PersonAttributes}
      organization={mockOrganization}
    />,
    { initialState: mockState },
  ).snapshot();

  expect(orgIsCru).toHaveBeenCalledWith(mockOrganization);
  expect(hasOrgPermissions).toHaveBeenCalledWith(mockOrgPermission);
});

it('renders cru org contact without stage correctly', () => {
  (orgIsCru as jest.Mock).mockReturnValue(true);
  (hasOrgPermissions as jest.Mock).mockReturnValue(false);

  renderWithContext(
    <PersonItem
      onSelect={onSelect}
      person={
        ({
          ...mockPerson,
          reverse_contact_assignments: [mockContactAssignmentNoStage],
        } as unknown) as PersonAttributes
      }
      organization={mockOrganization}
    />,
    { initialState: mockState },
  ).snapshot();

  expect(orgIsCru).toHaveBeenCalledWith(mockOrganization);
  expect(hasOrgPermissions).toHaveBeenCalledWith(mockOrgPermission);
});

it('renders uncontacted cru org contact correctly', () => {
  (orgIsCru as jest.Mock).mockReturnValue(true);
  (hasOrgPermissions as jest.Mock).mockReturnValue(false);

  renderWithContext(
    <PersonItem
      onSelect={onSelect}
      person={
        ({
          ...mockPerson,
          organizational_permissions: [mockOrgPermissionUncontacted],
        } as unknown) as PersonAttributes
      }
      organization={mockOrganization}
    />,
    { initialState: mockState },
  ).snapshot();

  expect(orgIsCru).toHaveBeenCalledWith(mockOrganization);
  expect(hasOrgPermissions).toHaveBeenCalledWith(mockOrgPermissionUncontacted);
});

it('renders cru org member correctly', () => {
  (orgIsCru as jest.Mock).mockReturnValue(true);
  (hasOrgPermissions as jest.Mock).mockReturnValue(true);

  renderWithContext(
    <PersonItem
      onSelect={onSelect}
      person={(mockPerson as unknown) as PersonAttributes}
      organization={mockOrganization}
    />,
    { initialState: mockState },
  ).snapshot();

  expect(orgIsCru).toHaveBeenCalledWith(mockOrganization);
  expect(hasOrgPermissions).toHaveBeenCalledWith(mockOrgPermission);
});

describe('handleChangeStage', () => {
  it('navigates to person stage screen', () => {
    const { getByTestId, store } = renderWithContext(
      <PersonItem
        onSelect={onSelect}
        person={
          ({
            ...mockPerson,
            reverse_contact_assignments: [mockContactAssignmentNoStage],
          } as unknown) as PersonAttributes
        }
        organization={mockOrganization}
      />,
      { initialState: mockState },
    );

    fireEvent.press(getByTestId('setStageButton'));

    expect(navigatePush).toHaveBeenCalledWith(SELECT_PERSON_STAGE_FLOW, {
      currentStage: null,
      name: mockPerson.first_name,
      contactId: mockPerson.id,
      contactAssignmentId: mockContactAssignment.id,
      section: 'people',
      subsection: 'person',
      orgId: mockOrganization.id,
    });
    expect(store.getActions()).toEqual([mockNavigatePushResult]);
  });
});

describe('item selected', () => {
  it('calls onSelect', () => {
    const { getByText } = renderWithContext(
      <PersonItem
        onSelect={onSelect}
        person={(mockPerson as unknown) as PersonAttributes}
        organization={mockOrganization}
      />,
      { initialState: mockState },
    );

    fireEvent.press(getByText('JOHN DOE'));

    expect(onSelect).toHaveBeenCalledWith(mockPerson, mockOrganization);
  });
});
