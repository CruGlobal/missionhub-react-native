/* eslint max-lines: 0 */

import 'react-native';
import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { MockList } from 'graphql-tools';
import { SectionList } from 'react-native';

import { renderWithContext } from '../../../../../testUtils';
import { ORG_PERMISSIONS } from '../../../../constants';
import {
  navigateToStageScreen,
  navigateToAddStepFlow,
} from '../../../../actions/misc';
import { useAnalytics } from '../../../../utils/hooks/useAnalytics';
import { PersonCollapsibleHeaderContext } from '../../PersonTabs';

import { PersonSteps } from '..';

jest.mock('../../../../actions/steps');
jest.mock('../../../../actions/misc');
jest.mock('../../../../components/StepItem', () => 'StepItem');
jest.mock('../../../../utils/hooks/useAnalytics');

const myId = '123';
const orgId = '1111';
const contactAssignment = {
  assigned_to: { id: myId },
};
const mePerson = {
  first_name: 'Christian',
  id: myId,
  reverse_contact_assignments: [],
  organizational_permissions: [
    { organization_id: orgId, permission_id: ORG_PERMISSIONS.OWNER },
  ],
};
const person = {
  first_name: 'ben',
  id: '1',
  reverse_contact_assignments: [
    { organization: undefined, assigned_to: { id: myId } },
  ],
  organizational_permissions: [
    { organization_id: orgId, permission_id: ORG_PERMISSIONS.OWNER },
  ],
};
const assignedPerson = {
  ...person,
  id: '2',
  reverse_contact_assignments: [contactAssignment],
};
const personWithStage = {
  ...assignedPerson,
  id: '3',
  reverse_contact_assignments: [
    { ...contactAssignment, pathway_stage_id: '2' },
  ],
};

const initialState = {
  steps: {
    mine: [],
    contactSteps: {
      '1-personal': { steps: [], completedSteps: [] },
    },
  },
  swipe: {
    stepsContact: true,
  },
  auth: {
    person: {
      id: myId,
    },
  },
  people: {
    people: {
      [mePerson.id]: mePerson,
      [person.id]: person,
      [assignedPerson.id]: assignedPerson,
      [personWithStage.id]: personWithStage,
    },
  },
};

beforeEach(() => {
  (navigateToStageScreen as jest.Mock).mockReturnValue({
    type: 'navigated to stage screen',
  });
  (navigateToAddStepFlow as jest.Mock).mockReturnValue({
    type: 'navigated to add step flow',
  });
});

it('renders correctly when no steps', () => {
  renderWithContext(
    <PersonSteps collapsibleHeaderContext={PersonCollapsibleHeaderContext} />,
    {
      initialState,
      navParams: {
        personId: person.id,
      },
    },
  ).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['person', 'my steps'], {
    assignmentType: { personId: person.id },
  });
});

it('renders correctly when me and no steps', () => {
  const { getByText, snapshot } = renderWithContext(
    <PersonSteps collapsibleHeaderContext={PersonCollapsibleHeaderContext} />,
    {
      initialState,
      navParams: {
        personId: mePerson.id,
      },
    },
  );
  snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['person', 'my steps'], {
    assignmentType: { personId: mePerson.id },
  });
  expect(getByText('Your Steps of Faith will appear here.')).toBeTruthy();
});

it('renders correctly with steps', async () => {
  const { snapshot } = renderWithContext(
    <PersonSteps collapsibleHeaderContext={PersonCollapsibleHeaderContext} />,
    {
      initialState,
      navParams: {
        personId: person.id,
      },
      mocks: {
        Query: () => ({
          person: () => ({
            steps: () => ({
              nodes: () => new MockList(1, () => ({ completedAt: null })),
              pageInfo: () => ({ totalCount: 0 }), // For completedSteps alias
            }),
          }),
        }),
      },
    },
  );

  expect(useAnalytics).toHaveBeenCalledWith(['person', 'my steps'], {
    assignmentType: { personId: person.id },
  });

  await flushMicrotasksQueue();

  snapshot();
});

it('should paginate', async () => {
  const { recordSnapshot, diffSnapshot, getByType } = renderWithContext(
    <PersonSteps collapsibleHeaderContext={PersonCollapsibleHeaderContext} />,
    {
      initialState,
      navParams: {
        personId: person.id,
      },
      mocks: {
        Query: () => ({
          person: () => ({
            steps: () => ({
              nodes: () => new MockList(1, () => ({ completedAt: null })),
              pageInfo: () => ({ totalCount: 0, hasNextPage: true }), // For completedSteps alias
            }),
          }),
        }),
      },
    },
  );

  await flushMicrotasksQueue();

  recordSnapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['person', 'my steps'], {
    assignmentType: { personId: person.id },
  });

  fireEvent(getByType(SectionList), 'onEndReached');

  await flushMicrotasksQueue();
  diffSnapshot();
});

it('renders correctly with completed steps', async () => {
  const { getByTestId, snapshot } = renderWithContext(
    <PersonSteps collapsibleHeaderContext={PersonCollapsibleHeaderContext} />,
    {
      initialState,
      navParams: {
        personId: person.id,
      },
      mocks: {
        Query: () => ({
          person: () => ({
            steps: () => ({
              nodes: () =>
                new MockList(1, (_, args) => ({
                  completedAt: args.completed ? '2019-01-01' : null,
                })),
              pageInfo: () => ({ totalCount: 1 }), // For completedSteps alias
            }),
          }),
        }),
      },
    },
  );
  await flushMicrotasksQueue();
  fireEvent.press(getByTestId('completedStepsButton'));
  await flushMicrotasksQueue();

  snapshot();
});

describe('handleCreateStep', () => {
  describe('for me', () => {
    it('navigates to select my steps flow', () => {
      const { getByTestId } = renderWithContext(
        <PersonSteps
          collapsibleHeaderContext={PersonCollapsibleHeaderContext}
        />,
        {
          initialState,
          navParams: {
            personId: mePerson.id,
          },
        },
      );

      fireEvent.press(getByTestId('bottomButton'));

      expect(navigateToAddStepFlow).toHaveBeenCalledWith(
        true,
        mePerson,
        undefined,
      );
    });
  });

  describe('for contact without stage', () => {
    it('navigates to select stage flow', () => {
      const { getByTestId } = renderWithContext(
        <PersonSteps
          collapsibleHeaderContext={PersonCollapsibleHeaderContext}
        />,
        {
          initialState,
          navParams: {
            personId: assignedPerson.id,
          },
        },
      );

      fireEvent.press(getByTestId('bottomButton'));

      expect(navigateToStageScreen).toHaveBeenCalledWith(
        false,
        assignedPerson,
        contactAssignment,
        undefined,
        undefined,
      );
    });
  });

  describe('for contact with stage', () => {
    it('navigates to select person steps flow', () => {
      const { getByTestId } = renderWithContext(
        <PersonSteps
          collapsibleHeaderContext={PersonCollapsibleHeaderContext}
        />,
        {
          initialState,
          navParams: {
            personId: personWithStage.id,
          },
        },
      );

      fireEvent.press(getByTestId('bottomButton'));

      expect(navigateToAddStepFlow).toHaveBeenCalledWith(
        false,
        personWithStage,
        undefined,
      );
    });
  });
});
