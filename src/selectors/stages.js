import { createSelector } from 'reselect';

export const stageSelector = createSelector(
  ({ stages }) => stages.stages || [],
  (_, { stageId }) => stageId,
  (stages, stageId) => stages.find(stage => `${stage.id}` === `${stageId}`),
);
