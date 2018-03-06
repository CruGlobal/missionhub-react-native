import { createSelector } from 'reselect';

const mapSteps = (steps, orgs) => steps.filter((s) => {
  return s.receiver && s.receiver.id;
}).map((step) => replaceStepReceiver(step, orgs));

const replaceStepReceiver = (step, orgs) => {
  const currentOrg = orgs[step.organization ? step.organization.id : 'personal'];
  const receiver = currentOrg.people[step.receiver.id] || step.receiver;
  return {
    ...step,
    receiver: receiver,
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
