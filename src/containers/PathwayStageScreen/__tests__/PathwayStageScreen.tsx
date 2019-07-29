import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { getStages } from '../../../actions/stages';
import { trackAction } from '../../../actions/analytics';
import { buildTrackingObj } from '../../../utils/common';
import { ACTIONS } from '../../../constants';

import PathwayStageScreen from '..';

jest.mock('react-native-device-info');
jest.mock('../../../actions/stages');
jest.mock('../../../actions/analytics');
jest.mock('../../../utils/hooks/useDisableBack');

const stages = [
  { id: 1, name: 'Stage 1', description: 'Stage 1 description' },
  { id: 2, name: 'Stage 2', description: 'Stage 2 description' },
  { id: 3, name: 'Stage 3', description: 'Stage 3 description' },
];
const onSelect = jest.fn();
const onScrollToStage = jest.fn();
const section = 'section';
const subsection = 'subsection';

const store = {
  stages: {
    stages,
  },
};

const baseParams = {
  onSelect,
  onScrollToStage,
  section,
  subsection,
  questionText: 'question?',
  buttonText: 'Press Me',
  activeButtonText: 'Already Pressed',
  enableBackButton: false,
  isSelf: false,
};

const trackActionResult = { type: 'track action' };
const getStagesResult = { type: 'get stages' };

beforeEach(() => {
  (trackAction as jest.Mock).mockReturnValue(trackActionResult);
  (getStages as jest.Mock).mockReturnValue(getStagesResult);
});

it('renders correctly', () => {
  renderWithContext(<PathwayStageScreen {...baseParams} />, {
    initialState: store,
  }).snapshot();
});

it('renders firstItem correctly', () => {
  renderWithContext(<PathwayStageScreen {...baseParams} firstItem={1} />, {
    initialState: store,
  }).snapshot();
});

it('renders correctly without stages', () => {
  renderWithContext(<PathwayStageScreen {...baseParams} />, {
    initialState: { stages: {} },
  }).snapshot();
});

it('renders back button correctly', () => {
  renderWithContext(
    <PathwayStageScreen {...baseParams} enableBackButton={true} />,
    {
      initialState: store,
    },
  ).snapshot();
});

describe('actions on mount', () => {
  const stageId = 1;
  const stage = stages[stageId];

  it('gets stages and snaps to first item on mount', async () => {
    const tracking = buildTrackingObj(
      `${section} : ${subsection} : stage : ${stage.id}`,
      section,
      subsection,
      'stage',
    );

    renderWithContext(
      <PathwayStageScreen {...baseParams} firstItem={stageId} />,
      {
        initialState: store,
      },
    );

    await flushMicrotasksQueue();

    expect(getStages).toHaveBeenCalledWith();
    expect(onScrollToStage).toHaveBeenCalledWith(tracking);
    expect(trackAction).toHaveBeenCalledWith(tracking);
  });
});

describe('setStage', () => {
  const stageId = 1;
  const stage = stages[stageId];
  const selfAction = ACTIONS.SELF_STAGE_SELECTED;
  const otherAction = ACTIONS.PERSON_STAGE_SELECTED;

  it('selects new stage for me', () => {
    const { getByTestId } = renderWithContext(
      <PathwayStageScreen {...baseParams} isSelf={true} />,
      {
        initialState: store,
      },
    );

    fireEvent.press(getByTestId(`StageButton${stageId}`));

    expect(onSelect).toHaveBeenCalledWith(stage, false);
    expect(trackAction).toHaveBeenCalledWith(selfAction.name, {
      [selfAction.key]: stage.id,
      [ACTIONS.STAGE_SELECTED.key]: null,
    });
  });

  it('selects already selected stage for me', () => {
    const { getByTestId } = renderWithContext(
      <PathwayStageScreen {...baseParams} isSelf={true} firstItem={stageId} />,
      {
        initialState: store,
      },
    );

    fireEvent.press(getByTestId(`StageButton${stageId}`));

    expect(onSelect).toHaveBeenCalledWith(stage, true);
    expect(trackAction).toHaveBeenCalledWith(selfAction.name, {
      [selfAction.key]: stage.id,
      [ACTIONS.STAGE_SELECTED.key]: null,
    });
  });

  it('selects new stage for other', () => {
    const { getByTestId } = renderWithContext(
      <PathwayStageScreen {...baseParams} isSelf={false} />,
      {
        initialState: store,
      },
    );

    fireEvent.press(getByTestId(`StageButton${stageId}`));

    expect(onSelect).toHaveBeenCalledWith(stage, false);
    expect(trackAction).toHaveBeenCalledWith(otherAction.name, {
      [otherAction.key]: stage.id,
      [ACTIONS.STAGE_SELECTED.key]: null,
    });
  });

  it('selects already selected stage for other', () => {
    const { getByTestId } = renderWithContext(
      <PathwayStageScreen {...baseParams} isSelf={false} firstItem={stageId} />,
      {
        initialState: store,
      },
    );

    fireEvent.press(getByTestId(`StageButton${stageId}`));

    expect(onSelect).toHaveBeenCalledWith(stage, true);
    expect(trackAction).toHaveBeenCalledWith(otherAction.name, {
      [otherAction.key]: stage.id,
      [ACTIONS.STAGE_SELECTED.key]: null,
    });
  });
});
