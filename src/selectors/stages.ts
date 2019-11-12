import { createSelector } from 'reselect';

import { Stage, StagesState } from '../reducers/stages';

export const stageSelector = createSelector(
  ({ stages: { stages } }: { stages: StagesState }) => stages,
  (_: { stages: StagesState }, { stageId }: { stageId: string }) => stageId,
  (stages: Stage[], stageId) => stages.find(({ id }) => id === stageId),
);
