import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { contactAssignmentSelector } from '../../../selectors/people';
import { navigateToStageScreen } from '../../../actions/misc';
import { getStageIndex } from '../../../utils/common';

import AssignStageButton from '..';

jest.mock('../../../selectors/people');
jest.mock('../../../actions/misc');
jest.mock('../../../utils/common');

const myId = '25';
const otherId = '52';
const stageId = '1';

const mockContactAssignment = {
  id: '123',
  pathway_stage_id: stageId,
};
const navigateToStageResult = { type: 'navigate to stage screen' };

const initialState = {
  auth: { person: { id: myId, user: { pathway_stage_id: stageId } } },
  people: {},
  stages: {
    stages: [
      {
        id: stageId,
        name: 'Stage Name',
      },
    ],
  },
};

const props = {
  person: { id: '1' },
  organization: { id: '11' },
};

beforeEach(() => {
  ((contactAssignmentSelector as unknown) as jest.Mock).mockReturnValue(
    mockContactAssignment,
  );
  (navigateToStageScreen as jest.Mock).mockReturnValue(navigateToStageResult);
  (getStageIndex as jest.Mock).mockReturnValue(stageId);
});

it('renders correctly for me', () => {
  renderWithContext(<AssignStageButton {...props} person={{ id: myId }} />, {
    initialState,
  }).snapshot();
});

it('renders correctly for me without person', () => {
  renderWithContext(<AssignStageButton {...props} person={undefined} />, {
    initialState,
  }).snapshot();
});

it('renders correctly for me without organization', () => {
  renderWithContext(<AssignStageButton {...props} organization={undefined} />, {
    initialState,
  }).snapshot();
});

it('renders correctly for me without stage', () => {
  renderWithContext(<AssignStageButton {...props} person={{ id: myId }} />, {
    initialState: {
      ...initialState,
      auth: {
        person: {
          id: myId,
          user: {},
        },
      },
    },
  }).snapshot();
});

it('renders correctly for other', () => {
  renderWithContext(<AssignStageButton {...props} person={{ id: otherId }} />, {
    initialState,
  });
});

it('renders correctly for other without stage', () => {
  ((contactAssignmentSelector as unknown) as jest.Mock).mockReturnValue({});
  renderWithContext(<AssignStageButton {...props} person={{ id: otherId }} />, {
    initialState,
  });
});

describe('assignStage', () => {
  describe('for me', () => {
    it('navigates to select my steps flow', () => {
      const person = { id: myId };
      const { getByTestId } = renderWithContext(
        <AssignStageButton {...props} person={person} />,
        { initialState },
      );

      fireEvent.press(getByTestId('AssignStageButton'));

      expect(navigateToStageScreen).toHaveBeenCalledWith(
        true,
        person,
        null,
        props.organization,
        stageId,
      );
    });
  });

  describe('for other', () => {
    it('navigates to select person steps flow', () => {
      const person = { id: otherId };
      const { getByTestId } = renderWithContext(
        <AssignStageButton {...props} person={person} />,
        { initialState },
      );

      fireEvent.press(getByTestId('AssignStageButton'));

      expect(navigateToStageScreen).toHaveBeenCalledWith(
        false,
        person,
        mockContactAssignment,
        props.organization,
        stageId,
      );
    });
  });
});
