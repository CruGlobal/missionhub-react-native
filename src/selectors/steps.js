import { createSelector } from 'reselect';

const mapSteps = (steps, orgs) => steps.map((step) => replaceStepReceiver(step, orgs));

const replaceStepReceiver = (step, orgs) => {
  const currentOrg = orgs[step.organization ? step.organization.id : 'personal'];
  return {
    ...step,
    receiver: currentOrg && currentOrg.people[step.receiver.id] || step.receiver,
  };
};

export const reminderStepsSelector = createSelector(
  ({ steps }) => steps.reminders,
  ({ people }) => people.allByOrg,
  mapSteps
);

export const nonReminderStepsSelector = createSelector(
  ({ steps }) => steps.mine.filter((s)=> !s.reminder),
  ({ people }) => people.allByOrg,
  mapSteps
);
