/* eslint max-lines: 0 */
import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import {
  navigateToStageScreen,
  navigateToAddStepFlow,
} from '../../../actions/misc';
import { navToPersonScreen } from '../../../actions/person';
import { orgIsCru, hasOrgPermissions } from '../../../utils/common';

import PersonItem from '..';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/misc');
jest.mock('../../../actions/person');
jest.mock('../../../utils/common');

const myId = '1';
const otherId = '2';
const stageId = '3';

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

const mockPersonalMinistry = { id: 'personal' };
const mockOrganization = { id: '111', user_created: false };

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
  pathway_stage_id: stageId,
};
const mockContactAssignmentNoStage = {
  id: '90',
  assigned_to: { id: myId },
};
const mockPerson = {
  id: otherId,
  first_name: 'John',
  last_name: 'Doe',
  full_name: 'John Doe',
  organizational_permissions: [mockOrgPermission],
  reverse_contact_assignments: [mockContactAssignment],
};
const mePerson = { ...mockPerson, id: myId, reverse_contact_assignments: [] };

const navToPersonScreenResult = { type: 'nav to person screen' };
const navigateToStageScreenResult = { type: 'nav to stage screen' };
const navigateToAddStepFlowResult = { type: 'nav to add step flow' };

beforeEach(() => {
  (navToPersonScreen as jest.Mock).mockReturnValue(navToPersonScreenResult);
  (navigateToStageScreen as jest.Mock).mockReturnValue(
    navigateToStageScreenResult,
  );
  (navigateToAddStepFlow as jest.Mock).mockReturnValue(
    navigateToAddStepFlowResult,
  );
});

it('renders me correctly', () => {
  (orgIsCru as jest.Mock).mockReturnValue(false);
  (hasOrgPermissions as jest.Mock).mockReturnValue(false);

  renderWithContext(
    <PersonItem
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
      person={(mockPerson as unknown) as PersonAttributes}
      organization={mockOrganization}
    />,
    { initialState: mockState },
  ).snapshot();

  expect(orgIsCru).toHaveBeenCalledWith(mockOrganization);
  expect(hasOrgPermissions).toHaveBeenCalledWith(mockOrgPermission);
});

describe('handleChangeStage', () => {
  describe('isMe', () => {
    it('navigates to my stage screen without stage', () => {
      const { getByTestId, store } = renderWithContext(
        <PersonItem
          person={(mePerson as unknown) as PersonAttributes}
          organization={mockOrganization}
        />,
        {
          initialState: {
            ...mockState,
            auth: {
              person: {
                id: myId,
                stage: undefined,
              },
            },
          },
        },
      );

      fireEvent.press(getByTestId('stageText'));

      expect(navigateToStageScreen).toHaveBeenCalledWith(
        true,
        mePerson,
        {},
        mockOrganization,
        undefined,
      );
      expect(store.getActions()).toEqual([navigateToStageScreenResult]);
    });
  });

  describe('not isMe', () => {
    it('navigates to person stage screen without stage', () => {
      const mockPersonNoStage = {
        ...mockPerson,
        reverse_contact_assignments: [mockContactAssignmentNoStage],
      };

      const { getByTestId, store } = renderWithContext(
        <PersonItem
          person={(mockPersonNoStage as unknown) as PersonAttributes}
          organization={mockOrganization}
        />,
        { initialState: mockState },
      );

      fireEvent.press(getByTestId('stageText'));

      expect(navigateToStageScreen).toHaveBeenCalledWith(
        false,
        mockPersonNoStage,
        mockContactAssignmentNoStage,
        mockOrganization,
        undefined,
      );
      expect(store.getActions()).toEqual([navigateToStageScreenResult]);
    });
  });
});

describe('handleSelect', () => {
  it('navigate to person view for me', () => {
    const { getByTestId, store } = renderWithContext(
      <PersonItem
        person={(mePerson as unknown) as PersonAttributes}
        organization={mockOrganization}
      />,
      { initialState: mockState },
    );

    fireEvent.press(getByTestId('personCard'));

    expect(navToPersonScreen).toHaveBeenCalledWith(mePerson, mockOrganization);
    expect(store.getActions()).toEqual([navToPersonScreenResult]);
  });

  it('navigate to person view for other', () => {
    const { getByTestId, store } = renderWithContext(
      <PersonItem
        person={(mockPerson as unknown) as PersonAttributes}
        organization={mockOrganization}
      />,
      { initialState: mockState },
    );

    fireEvent.press(getByTestId('personCard'));

    expect(navToPersonScreen).toHaveBeenCalledWith(
      mockPerson,
      mockOrganization,
    );
    expect(store.getActions()).toEqual([navToPersonScreenResult]);
  });

  it('navigate to person view with no org if orgId === "personal"', () => {
    const { getByTestId, store } = renderWithContext(
      <PersonItem
        person={(mockPerson as unknown) as PersonAttributes}
        organization={mockPersonalMinistry}
      />,
      { initialState: mockState },
    );

    fireEvent.press(getByTestId('personCard'));

    expect(navToPersonScreen).toHaveBeenCalledWith(mockPerson, undefined);
    expect(store.getActions()).toEqual([navToPersonScreenResult]);
  });
});

describe('handleAddStep', () => {
  it('navigate to select step for me', () => {
    const { getByTestId, store } = renderWithContext(
      <PersonItem
        person={(mePerson as unknown) as PersonAttributes}
        organization={mockOrganization}
      />,
      { initialState: mockState },
    );

    fireEvent.press(getByTestId('stepIcon'));

    expect(navigateToAddStepFlow).toHaveBeenCalledWith(
      true,
      mePerson,
      mockOrganization,
    );
    expect(store.getActions()).toEqual([navigateToAddStepFlowResult]);
  });

  it('navigate to person view for other', () => {
    const { getByTestId, store } = renderWithContext(
      <PersonItem
        person={(mockPerson as unknown) as PersonAttributes}
        organization={mockOrganization}
      />,
      { initialState: mockState },
    );

    fireEvent.press(getByTestId('stepIcon'));

    expect(navigateToAddStepFlow).toHaveBeenCalledWith(
      false,
      mockPerson,
      mockOrganization,
    );
    expect(store.getActions()).toEqual([navigateToAddStepFlowResult]);
  });
});
