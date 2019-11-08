import 'react-native';
import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { getContactSteps } from '../../../actions/steps';
import {
  navigateToStageScreen,
  navigateToAddStepFlow,
  assignContactAndPickStage,
} from '../../../actions/misc';
import { contactAssignmentSelector } from '../../../selectors/people';
import { promptToAssign } from '../../../utils/prompt';

import ContactSteps from '..';

jest.mock('../../../actions/steps');
jest.mock('../../../actions/misc');
jest.mock('../../../selectors/people');
jest.mock('../../../utils/prompt');
jest.mock('../../../components/AcceptedStepItem', () => 'AcceptedStepItem');

const steps = [{ id: '1', title: 'Test Step' }];
const completedSteps = [{ id: '1', title: 'Test Step', completed_at: 'time' }];

const myId = '123';
const person = {
  first_name: 'ben',
  id: '1',
  reverse_contact_assignments: [],
};
const organization = { id: '1111', user_created: true };
const contactAssignment = {
  id: 333,
};

const initialStateNoSteps = {
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
const initialStateWithSteps = {
  ...initialStateNoSteps,
  steps: {
    mine: [],
    contactSteps: {
      '1-personal': { steps, completedSteps: [] },
    },
  },
};
const initialStateWithStepsOrg = {
  ...initialStateNoSteps,
  steps: {
    mine: [],
    contactSteps: {
      '1-1111': { steps, completedSteps: [] },
    },
  },
};
const initialStateWithCompleted = {
  ...initialStateNoSteps,
  steps: {
    mine: [],
    contactSteps: {
      '1-personal': { steps, completedSteps },
    },
  },
};

beforeEach(() => {
  jest.clearAllMocks();
  (getContactSteps as jest.Mock).mockReturnValue(() => {
    response: steps;
  });
  (navigateToStageScreen as jest.Mock).mockReturnValue({
    type: 'navigated to stage screen',
  });
  (navigateToAddStepFlow as jest.Mock).mockReturnValue({
    type: 'navigated to add step flow',
  });
});

it('renders correctly with no steps', () => {
  renderWithContext(<ContactSteps person={person} />, {
    initialState: initialStateNoSteps,
  }).snapshot();

  expect(getContactSteps).toHaveBeenCalledWith(person.id, 'personal');
});

it('renders correctly with steps', () => {
  renderWithContext(<ContactSteps person={person} />, {
    initialState: initialStateWithSteps,
  }).snapshot();

  expect(getContactSteps).toHaveBeenCalledWith(person.id, 'personal');
});

it('renders correctly with completed steps', () => {
  const { getByTestId, snapshot } = renderWithContext(
    <ContactSteps person={person} />,
    {
      initialState: initialStateWithCompleted,
    },
  );

  fireEvent.press(getByTestId('completedStepsButton'));

  snapshot();

  expect(getContactSteps).toHaveBeenCalledWith(person.id, 'personal');
});

it('renders correctly with org', () => {
  renderWithContext(
    <ContactSteps person={person} organization={organization} />,
    {
      initialState: initialStateWithStepsOrg,
    },
  ).snapshot();

  expect(getContactSteps).toHaveBeenCalledWith(person.id, organization.id);
});

describe('step item', () => {
  it('gets contact steps on complete step', () => {
    const { getByTestId } = renderWithContext(
      <ContactSteps person={person} />,
      {
        initialState: initialStateWithSteps,
      },
    );

    fireEvent(getByTestId('stepItem'), 'onComplete');

    expect(getContactSteps).toHaveBeenCalledTimes(2);
    expect(getContactSteps).toHaveBeenCalledWith(person.id, 'personal');
  });
});

describe('handleCreateStep', () => {
  describe('for me', () => {
    it('navigates to select my steps flow', () => {
      const mePerson = { ...person, id: myId };

      const { getByTestId } = renderWithContext(
        <ContactSteps person={mePerson} organization={organization} />,
        {
          initialState: initialStateWithSteps,
        },
      );

      fireEvent.press(getByTestId('bottomButton'));

      expect(navigateToAddStepFlow).toHaveBeenCalledWith(
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
          initialState: initialStateWithSteps,
        },
      );

      fireEvent.press(getByTestId('bottomButton'));

      expect(navigateToStageScreen).toHaveBeenCalledWith(
        false,
        person,
        contactAssignment,
        organization,
        null,
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
          initialState: initialStateWithSteps,
        },
      );

      fireEvent.press(getByTestId('bottomButton'));

      expect(navigateToAddStepFlow).toHaveBeenCalledWith(person, organization);
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
            initialState: initialStateWithSteps,
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
            initialState: initialStateWithSteps,
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
          initialState: initialStateWithSteps,
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
