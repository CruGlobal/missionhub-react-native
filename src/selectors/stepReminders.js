import { createSelector } from 'reselect';

export const reminderSelector = createSelector(
  ({ stepReminders }) => stepReminders,
  (_, { stepId }) => stepId,
  (stepReminders, stepId) => stepReminders.all[stepId] || {},
);
