import { createSelector } from 'reselect';
import { contactAssignmentSelector, isMeSelector } from './people';

export const stageSelector = createSelector(
  ({ stages }) => stages.stages || [],
  (_, { stageId }) => stageId,
  (stages, stageId) => stages.find(stage => `${stage.id}` === `${stageId}`), // TODO: remove casting when MHP-2090 is deployed
);

export const stageIdSelector = createSelector(
  isMeSelector,
  ({ auth }) => auth.person.user,
  contactAssignmentSelector,
  (isMe, meUser = {}, personContactAssignment = {}) => {
    const stageId = (isMe ? meUser : personContactAssignment).pathway_stage_id;
    return stageId ? `${stageId}` : undefined; // TODO: remove casting when MHP-2090 is deployed
  },
);
