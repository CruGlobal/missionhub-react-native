import { createSelector } from 'reselect';

export const reminderSelector = createSelector(
  ({ stepReminders }) => stepReminders,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (_: any, { stepId }: { stepId: string }) => stepId,
  (stepReminders, stepId) => stepReminders.allByStep[stepId],
);
