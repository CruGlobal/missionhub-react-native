import { createSelector } from 'reselect';

import { StepReminderState } from '../reducers/stepReminders';

export const reminderSelector = createSelector(
  ({ stepReminders }: { stepReminders: StepReminderState }) => stepReminders,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (_: { stepReminders: StepReminderState }, { stepId }: { stepId: string }) =>
    stepId,
  (stepReminders, stepId) => stepReminders.allByStep[stepId],
);
