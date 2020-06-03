/* eslint max-lines: 0 */

import 'react-native';
import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { MockList } from 'graphql-tools';
import { SectionList } from 'react-native';

import { renderWithContext } from '../../../../testUtils';
import { ANALYTICS_ASSIGNMENT_TYPE, ORG_PERMISSIONS } from '../../../constants';
import {
  navigateToStageScreen,
  navigateToAddStepFlow,
} from '../../../actions/misc';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';

import ContactSteps from '..';

jest.mock('../../../actions/steps');
jest.mock('../../../actions/misc');
jest.mock('../../../utils/prompt');
jest.mock('../../../components/StepItem', () => 'StepItem');
jest.mock('../../../utils/hooks/useAnalytics');

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
  reverse_contact_assignments: [contactAssignment],
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
  renderWithContext(<ContactSteps person={person} />, {
    initialState,
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['person', 'my steps'], {
    screenContext: { [ANALYTICS_ASSIGNMENT_TYPE]: 'contact' },
  });
});

it('renders correctly when me and no steps', () => {
  const { getByText, snapshot } = renderWithContext(
    <ContactSteps person={mePerson} />,
    {
      initialState,
    },
  );
  snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['person', 'my steps'], {
    screenContext: { [ANALYTICS_ASSIGNMENT_TYPE]: 'self' },
  });
  expect(getByText('Your Steps of Faith will appear here.')).toBeTruthy();
});

it('renders correctly with steps', async () => {
  const { snapshot } = renderWithContext(<ContactSteps person={person} />, {
    initialState,
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
  });

  expect(useAnalytics).toHaveBeenCalledWith(['person', 'my steps'], {
    screenContext: { [ANALYTICS_ASSIGNMENT_TYPE]: 'contact' },
  });

  await flushMicrotasksQueue();

  snapshot();
});

it('should paginate', async () => {
  const { recordSnapshot, diffSnapshot, getByType } = renderWithContext(
    <ContactSteps person={person} />,
    {
      initialState,
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
    screenContext: { [ANALYTICS_ASSIGNMENT_TYPE]: 'contact' },
  });

  fireEvent(getByType(SectionList), 'onEndReached');

  await flushMicrotasksQueue();
  diffSnapshot();
});

it('renders correctly with completed steps', async () => {
  const { getByTestId, snapshot } = renderWithContext(
    <ContactSteps person={person} />,
    {
      initialState,
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
      const mePerson = { ...person, id: myId };

      const { getByTestId } = renderWithContext(
        <ContactSteps person={mePerson} />,
        {
          initialState,
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
        <ContactSteps person={assignedPerson} />,
        {
          initialState,
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
      const personWithStage = {
        ...assignedPerson,
        reverse_contact_assignments: [
          { ...contactAssignment, pathway_stage_id: '2' },
        ],
      };

      const { getByTestId } = renderWithContext(
        <ContactSteps person={personWithStage} />,
        {
          initialState,
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
