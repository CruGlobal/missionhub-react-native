import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import SelectMyStageScreen from '../SelectMyStageScreen';
import { renderWithContext } from '../../../testUtils';
import { selectMyStage } from '../../actions/selectStage';
import { getStages } from '../../actions/stages';

jest.mock('react-native-device-info');
jest.mock('../../actions/selectStage');
jest.mock('../../actions/stages');

const section = 'section';
const subsection = 'subsection';
const orgId = '111';
const contactId = '123';

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
      id: contactId,
    },
  },
  profile: {
    firstName: 'Roger',
  },
  stages: { stages },
};

const baseParams = {
  section,
  subsection,
};

const selectMyStageResult = { type: 'select my stage' };
const getStagesResult = { type: 'get stages' };
const nextResult = { type: 'next' };

const next = jest.fn();

beforeEach(() => {
  selectMyStage.mockReturnValue(selectMyStageResult);
  getStages.mockReturnValue(getStagesResult);
  next.mockReturnValue(nextResult);
});

it('renders correctly with back button', () => {
  renderWithContext(<SelectMyStageScreen next={next} />, {
    initialState: mockState,
    navParams: {
      ...baseParams,
      enableBackButton: true,
    },
  }).snapshot();
});

it('renders correctly without back button', () => {
  renderWithContext(<SelectMyStageScreen next={next} />, {
    initialState: mockState,
    navParams: {
      ...baseParams,
      enableBackButton: false,
    },
  }).snapshot();
});

it('renders correctly with question text', () => {
  renderWithContext(<SelectMyStageScreen next={next} />, {
    initialState: mockState,
    navParams: {
      ...baseParams,
      questionText: 'QUESTION',
    },
  }).snapshot();
});

it('renders correctly with first item', () => {
  renderWithContext(<SelectMyStageScreen next={next} />, {
    initialState: mockState,
    navParams: {
      ...baseParams,
      firstItem: 1,
    },
  }).snapshot();
});

describe('handleSelectStage', () => {
  it('selects stage because not already selected', async () => {
    const { getByTestId, store } = renderWithContext(
      <SelectMyStageScreen next={next} />,
      {
        initialState: mockState,
        navParams: {
          ...baseParams,
          orgId,
        },
      },
    );

    await fireEvent.press(getByTestId(`StageButton${stageId}`));

    expect(selectMyStage).toHaveBeenCalledWith(stage.id);
    expect(next).toHaveBeenCalledWith({
      stage,
      contactId,
      orgId,
      isAlreadySelected: false,
    });
    expect(store.getActions()).toEqual([
      getStagesResult,
      selectMyStageResult,
      nextResult,
    ]);
  });

  it('does not select stage because already selected', async () => {
    const { getByTestId, store } = renderWithContext(
      <SelectMyStageScreen next={next} />,
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

    expect(selectMyStage).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith({
      stage,
      contactId,
      orgId,
      isAlreadySelected: true,
    });
    expect(store.getActions()).toEqual([getStagesResult, nextResult]);
  });
});
