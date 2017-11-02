import { STAGES } from '../constants';

export function getStages() {
  return {
    type: STAGES,
    payload: [0, 1, 2], // TODO make actual api call,
  };
}