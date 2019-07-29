import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import SelectPersonStageScreen from '../SelectPersonStageScreen';
import { renderWithContext } from '../../../testUtils';
import { selectPersonStage, updateUserStage } from '../../actions/selectStage';
import { getStages } from '../../actions/stages';

jest.mock('react-native-device-info');
jest.mock('../../actions/selectStage');
jest.mock('../../actions/stages');

const section = 'section';
const subsection = 'subsection';
const orgId = '111';
const myId = '321';
const contactId = '123';
const contactAssignmentId = '4';
const firstName = 'Roger';

const stages = [
  { id: 1, name: 'Stage 1', description: 'Stage 1 description' },
  { id: 2, name: 'Stage 2', description: 'Stage 2 description' },
  { id: 3, name: 'Stage 3', description: 'Stage 3 description' },
];
const stageId = 0;
const stage = stages[stageId];

const mockState = {
  auth: {
    person: {
      id: myId,
    },
  },
  personProfile: {
    id: contactId,
    personFirstName: firstName,
    contactAssignmentId,
  },
  stages: { stages },
};

const baseParams = {
  section,
  subsection,
};

const selectPersonStageResult = { type: 'select person stage' };
const updateUserStageResult = { type: 'update user stage' };
const getStagesResult = { type: 'get stages' };
const nextResult = { type: 'next' };

const next = jest.fn();

beforeEach(() => {
  (selectPersonStage as jest.Mock).mockReturnValue(selectPersonStageResult);
  (updateUserStage as jest.Mock).mockReturnValue(updateUserStageResult);
  (getStages as jest.Mock).mockReturnValue(getStagesResult);
  next.mockReturnValue(nextResult);
});

it('renders correctly with redux props', () => {
  renderWithContext(<SelectPersonStageScreen next={next} />, {
    initialState: mockState,
    navParams: baseParams,
  }).snapshot();
});

it('renders correctly with nav props', () => {
  renderWithContext(<SelectPersonStageScreen next={next} />, {
    initialState: mockState,
    navParams: {
      ...baseParams,
      contactId: '789',
      contactAssignmentId: '7',
      firstName: 'Bert',
    },
  }).snapshot();
});

it('renders correctly with back button', () => {
  renderWithContext(<SelectPersonStageScreen next={next} />, {
    initialState: mockState,
    navParams: {
      ...baseParams,
      enableBackButton: true,
    },
  }).snapshot();
});

it('renders correctly without back button', () => {
  renderWithContext(<SelectPersonStageScreen next={next} />, {
    initialState: mockState,
    navParams: {
      ...baseParams,
      enableBackButton: false,
    },
  }).snapshot();
});

it('renders correctly with question text', () => {
  renderWithContext(<SelectPersonStageScreen next={next} />, {
    initialState: mockState,
    navParams: {
      ...baseParams,
      questionText: 'QUESTION',
    },
  }).snapshot();
});

it('renders correctly with first item', () => {
  renderWithContext(<SelectPersonStageScreen next={next} />, {
    initialState: mockState,
    navParams: {
      ...baseParams,
      firstItem: 1,
    },
  }).snapshot();
});

describe('handleSelectStage', () => {
  describe('without contact assignment', () => {
    const mockStateNoContactAssignment = {
      ...mockState,
      personProfile: {
        ...mockState.personProfile,
        contactAssignmentId: null,
      },
    };

    it('selects stage because not already selected', async () => {
      const { getByTestId, store } = renderWithContext(
        <SelectPersonStageScreen next={next} />,
        {
          initialState: mockStateNoContactAssignment,
          navParams: {
            ...baseParams,
            orgId,
          },
        },
      );

      await fireEvent.press(getByTestId(`StageButton${stageId}`));

      expect(selectPersonStage).toHaveBeenCalledWith(
        contactId,
        myId,
        stage.id,
        orgId,
      );
      expect(updateUserStage).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith({
        stage,
        firstName,
        contactId,
        contactAssignmentId: null,
        orgId,
        isAlreadySelected: false,
      });
      expect(store.getActions()).toEqual([
        getStagesResult,
        selectPersonStageResult,
        nextResult,
      ]);
    });

    it('does not select stage because already selected', async () => {
      const { getByTestId, store } = renderWithContext(
        <SelectPersonStageScreen next={next} />,
        {
          initialState: mockStateNoContactAssignment,
          navParams: {
            ...baseParams,
            orgId,
            firstItem: stageId,
          },
        },
      );

      await fireEvent.press(getByTestId(`StageButton${stageId}`));

      expect(selectPersonStage).not.toHaveBeenCalled();
      expect(updateUserStage).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith({
        stage,
        firstName,
        contactId,
        contactAssignmentId: null,
        orgId,
        isAlreadySelected: true,
      });
      expect(store.getActions()).toEqual([getStagesResult, nextResult]);
    });
  });

  describe('with contactAssignment', () => {
    it('selects stage because not already selected', async () => {
      const { getByTestId, store } = renderWithContext(
        <SelectPersonStageScreen next={next} />,
        {
          initialState: mockState,
          navParams: {
            ...baseParams,
            orgId,
          },
        },
      );

      await fireEvent.press(getByTestId(`StageButton${stageId}`));

      expect(selectPersonStage).not.toHaveBeenCalled();
      expect(updateUserStage).toHaveBeenCalledWith(
        contactAssignmentId,
        stage.id,
      );
      expect(next).toHaveBeenCalledWith({
        stage,
        firstName,
        contactId,
        contactAssignmentId,
        orgId,
        isAlreadySelected: false,
      });
      expect(store.getActions()).toEqual([
        getStagesResult,
        updateUserStageResult,
        nextResult,
      ]);
    });

    it('does not select stage because already selected', async () => {
      const { getByTestId, store } = renderWithContext(
        <SelectPersonStageScreen next={next} />,
        {
          initialState: mockState,
          navParams: {
            ...baseParams,
            orgId,
            firstItem: stageId,
          },
        },
      );

      await fireEvent.press(getByTestId(`StageButton${stageId}`));

      expect(selectPersonStage).not.toHaveBeenCalled();
      expect(updateUserStage).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith({
        stage,
        firstName,
        contactId,
        contactAssignmentId,
        orgId,
        isAlreadySelected: true,
      });
      expect(store.getActions()).toEqual([getStagesResult, nextResult]);
    });
  });
});
