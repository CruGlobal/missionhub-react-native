import { createSelector } from 'reselect';

import { StepsState } from '../reducers/steps';

export const myStepsSelector = createSelector(
  ({ steps }: { steps: StepsState }) => steps.mine,
  mySteps => mySteps && mySteps.filter(s => s.receiver && s.receiver.id),
);
