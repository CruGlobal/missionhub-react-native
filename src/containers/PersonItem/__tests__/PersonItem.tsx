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
import { GetPeopleStepsCount_communities_nodes_people_nodes as PersonStepCount } from '../../../components/PeopleList/__generated__/GetPeopleStepsCount';

import PersonItem from '..';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/misc');
jest.mock('../../../actions/person');
jest.mock('../../../utils/common');

const myId = '1';
const otherId = '2';
const stageId = '3';
const mockStepsCount = 4;

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
const mockOrganization = { id: '111' };

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
const mockPersonWithSteps = {
  id: otherId,
  first_name: 'Graph',
  last_name: 'Champion',
  full_name: 'Graph Champion',
  organizational_permissions: [mockOrgPermission],
  reverse_contact_assignments: [mockContactAssignment],
  totalCount: mockStepsCount,
};
const mockPersonWithNoStage = {
  ...mockPerson,
  reverse_contact_assignments: [mockContactAssignmentNoStage],
};

const totalStepCount: PersonStepCount = {
  __typename: 'Person',
  id: mockPersonWithSteps.id,
  steps: {
    __typename: 'StepConnection',
    pageInfo: {
      __typename: 'BasePageInfo',
      totalCount: mockStepsCount,
    },
  },
};

const noStepsCount: PersonStepCount = {
  ...totalStepCount,
  steps: {
    __typename: 'StepConnection',
    pageInfo: {
      __typename: 'BasePageInfo',
      totalCount: 0,
    },
  },
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
      stepsData={totalStepCount}
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
      stepsData={totalStepCount}
    />,
    { initialState: mockState },
  ).snapshot();

  expect(orgIsCru).toHaveBeenCalledWith(mockPersonalMinistry);
  expect(hasOrgPermissions).not.toHaveBeenCalled();
});

it('renders personal ministry with no steps correctly', () => {
  (orgIsCru as jest.Mock).mockReturnValue(false);
  (hasOrgPermissions as jest.Mock).mockReturnValue(false);

  const { getByTestId, snapshot } = renderWithContext(
    <PersonItem
      person={(mockPersonWithSteps as unknown) as PersonAttributes}
      organization={mockPersonalMinistry}
      stepsData={noStepsCount}
    />,
    {
      initialState: mockState,
    },
  );
  snapshot();
  expect(getByTestId('stepIcon')).toBeTruthy();
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
      stepsData={totalStepCount}
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
      person={(mockPersonWithNoStage as unknown) as PersonAttributes}
      organization={mockOrganization}
      stepsData={totalStepCount}
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
      stepsData={totalStepCount}
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
      stepsData={totalStepCount}
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
          stepsData={totalStepCount}
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
          stepsData={totalStepCount}
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
        stepsData={totalStepCount}
      />,
      { initialState: mockState },
    );

    fireEvent.press(getByTestId('personCard'));

    expect(navToPersonScreen).toHaveBeenCalledWith(mePerson.id);
    expect(store.getActions()).toEqual([navToPersonScreenResult]);
  });

  it('navigate to person view for other', () => {
    const { getByTestId, store } = renderWithContext(
      <PersonItem
        person={(mockPerson as unknown) as PersonAttributes}
        organization={mockOrganization}
        stepsData={totalStepCount}
      />,
      { initialState: mockState },
    );

    fireEvent.press(getByTestId('personCard'));

    expect(navToPersonScreen).toHaveBeenCalledWith(mockPerson.id);
    expect(store.getActions()).toEqual([navToPersonScreenResult]);
  });

  it('navigate to person view with no org if orgId === "personal"', () => {
    const { getByTestId, store } = renderWithContext(
      <PersonItem
        person={(mockPerson as unknown) as PersonAttributes}
        organization={mockPersonalMinistry}
        stepsData={totalStepCount}
      />,
      { initialState: mockState },
    );

    fireEvent.press(getByTestId('personCard'));

    expect(navToPersonScreen).toHaveBeenCalledWith(mockPerson.id);
    expect(store.getActions()).toEqual([navToPersonScreenResult]);
  });
});

describe('handleAddStep', () => {
  it('navigate to select step for me', () => {
    const { getByTestId, store } = renderWithContext(
      <PersonItem
        person={(mePerson as unknown) as PersonAttributes}
        organization={mockOrganization}
        stepsData={noStepsCount}
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
        stepsData={noStepsCount}
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

  it('navigate to select stage for other person without stage', () => {
    const { getByTestId, store } = renderWithContext(
      <PersonItem
        person={(mockPersonWithNoStage as unknown) as PersonAttributes}
        organization={mockOrganization}
        stepsData={noStepsCount}
      />,
      { initialState: mockState },
    );

    fireEvent.press(getByTestId('stepIcon'));

    expect(navigateToStageScreen).toHaveBeenCalledWith(
      false,
      mockPersonWithNoStage,
      mockContactAssignmentNoStage,
      mockOrganization,
      undefined,
    );
    expect(store.getActions()).toEqual([navigateToStageScreenResult]);
  });
});
