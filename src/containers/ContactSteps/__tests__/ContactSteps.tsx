import 'react-native';
import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { MockList } from 'graphql-tools';
import { SectionList } from 'react-native';

import { renderWithContext } from '../../../../testUtils';
import {
  navigateToStageScreen,
  navigateToAddStepFlow,
  assignContactAndPickStage,
} from '../../../actions/misc';
import { contactAssignmentSelector } from '../../../selectors/people';
import { promptToAssign } from '../../../utils/prompt';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';

import ContactSteps from '..';

jest.mock('../../../actions/steps');
jest.mock('../../../actions/misc');
jest.mock('../../../selectors/people');
jest.mock('../../../utils/prompt');
jest.mock('../../../components/StepItem', () => 'StepItem');
jest.mock('../../../utils/hooks/useAnalytics');

const myId = '123';
const mePerson = {
  first_name: 'Christian',
  id: myId,
  reverse_contact_assignments: [],
};
const person = {
  first_name: 'ben',
  id: '1',
  reverse_contact_assignments: [],
};
const organization = { id: '1111', user_created: true };
const contactAssignment = {
  id: 333,
};

const initialState = {
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
  renderWithContext(
    <ContactSteps person={person} organization={{ id: undefined }} />,
    {
      initialState,
    },
  ).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['person', 'my steps']);
});

it('renders correctly when me and no steps', () => {
  const { getByText, snapshot } = renderWithContext(
    <ContactSteps person={mePerson} organization={{ id: undefined }} />,
    {
      initialState,
    },
  );
  snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['person', 'my steps']);
  expect(getByText('Your Steps of Faith will appear here.')).toBeTruthy();
});

it('renders correctly with steps', async () => {
  const { snapshot } = renderWithContext(
    <ContactSteps person={person} organization={{ id: undefined }} />,
    {
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
    },
  );

  await flushMicrotasksQueue();

  snapshot();
});

it('should paginate', async () => {
  const { recordSnapshot, diffSnapshot, getByType } = renderWithContext(
    <ContactSteps person={person} organization={{ id: undefined }} />,
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

  fireEvent(getByType(SectionList), 'onEndReached');

  await flushMicrotasksQueue();
  diffSnapshot();
});

it('renders correctly with completed steps', async () => {
  const { getByTestId, snapshot } = renderWithContext(
    <ContactSteps person={person} organization={{ id: undefined }} />,
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
        <ContactSteps person={mePerson} organization={organization} />,
        {
          initialState,
        },
      );

      fireEvent.press(getByTestId('bottomButton'));

      expect(navigateToAddStepFlow).toHaveBeenCalledWith(
        true,
        mePerson,
        organization,
      );
    });
  });

  describe('for contact without stage', () => {
    it('navigates to select stage flow', () => {
      ((contactAssignmentSelector as unknown) as jest.Mock).mockReturnValue(
        contactAssignment,
      );

      const { getByTestId } = renderWithContext(
        <ContactSteps person={person} organization={organization} />,
        {
          initialState,
        },
      );

      fireEvent.press(getByTestId('bottomButton'));

      expect(navigateToStageScreen).toHaveBeenCalledWith(
        false,
        person,
        contactAssignment,
        organization,
        undefined,
      );
    });
  });

  describe('for contact with stage', () => {
    it('navigates to select person steps flow', () => {
      ((contactAssignmentSelector as unknown) as jest.Mock).mockReturnValue({
        ...contactAssignment,
        pathway_stage_id: '2',
      });

      const { getByTestId } = renderWithContext(
        <ContactSteps person={person} organization={organization} />,
        {
          initialState,
        },
      );

      fireEvent.press(getByTestId('bottomButton'));

      expect(navigateToAddStepFlow).toHaveBeenCalledWith(
        false,
        person,
        organization,
      );
    });
  });

  describe('for unassigned contact in Cru org', () => {
    describe('agrees to prompt', () => {
      it('assigns the contact to me', async () => {
        const cruOrg = { ...organization, user_created: false };
        ((contactAssignmentSelector as unknown) as jest.Mock).mockReturnValue(
          null,
        );
        ((promptToAssign as unknown) as jest.Mock).mockReturnValue(
          Promise.resolve(true),
        );

        const { getByTestId } = renderWithContext(
          <ContactSteps person={person} organization={cruOrg} />,
          {
            initialState,
          },
        );

        fireEvent.press(getByTestId('bottomButton'));

        await flushMicrotasksQueue();

        expect(promptToAssign).toHaveBeenCalled();
        expect(assignContactAndPickStage).toHaveBeenCalledWith(person, cruOrg);
      });
    });

    describe('disagrees to prompt', () => {
      it('does not assign the contact to me', async () => {
        ((contactAssignmentSelector as unknown) as jest.Mock).mockReturnValue(
          null,
        );
        ((promptToAssign as unknown) as jest.Mock).mockReturnValue(
          Promise.resolve(false),
        );

        const { getByTestId } = renderWithContext(
          <ContactSteps
            person={person}
            organization={{ ...organization, user_created: false }}
          />,
          {
            initialState,
          },
        );

        fireEvent.press(getByTestId('bottomButton'));

        await flushMicrotasksQueue();

        expect(promptToAssign).toHaveBeenCalled();
        expect(assignContactAndPickStage).not.toHaveBeenCalled();
      });
    });
  });

  describe('for unassigned contact in user created org', () => {
    it('assigns the contact to me without prompt', async () => {
      ((contactAssignmentSelector as unknown) as jest.Mock).mockReturnValue(
        null,
      );

      const { getByTestId } = renderWithContext(
        <ContactSteps person={person} organization={organization} />,
        {
          initialState,
        },
      );

      fireEvent.press(getByTestId('bottomButton'));

      await flushMicrotasksQueue();

      expect(assignContactAndPickStage).toHaveBeenCalledWith(
        person,
        organization,
      );
    });
  });
});
