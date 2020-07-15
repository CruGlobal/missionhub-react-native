import { createSelector } from 'reselect';

import { StepReminderState } from '../reducers/stepReminders';

export const reminderSelector = createSelector(
  ({ stepReminders }: { stepReminders: StepReminderState }) => stepReminders,
  (_: { stepReminders: StepReminderState }, { stepId }: { stepId: string }) =>
    stepId,
  (stepReminders, stepId) => stepReminders.allByStep[stepId],
);
