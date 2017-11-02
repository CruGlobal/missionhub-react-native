import { SELECT_STAGE } from '../constants';

export function selectStage(id) {
  return {
    type: SELECT_STAGE,
    payload: {
      stageId: id,
    },
  };
}