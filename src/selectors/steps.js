import { createSelector } from 'reselect';

const filterFocus = (steps, focused) =>
  steps.mine && steps.mine.filter(s => (focused ? s.focus : !s.focus));

const filterOutMissingReceivers = steps =>
  steps && steps.filter(s => s.receiver && s.receiver.id);

const mapSteps = (steps, orgs) =>
  steps &&
  filterOutMissingReceivers(steps).map(step => replaceStepReceiver(step, orgs));

const replaceStepReceiver = (step, orgs) => {
  const currentOrg =
    orgs[step.organization ? step.organization.id : 'personal'];
  const receiver =
    (currentOrg && currentOrg.people[step.receiver.id]) || step.receiver;
  return {
    ...step,
    receiver: receiver,
  };
};

export const hasReminderStepsSelector = createSelector(
  ({ steps }) => filterFocus(steps, true),
  steps => filterOutMissingReceivers(steps).length > 0,
);

export const reminderStepsSelector = createSelector(
  ({ steps }) => filterFocus(steps, true),
  ({ people }) => people.allByOrg,
  mapSteps,
);

export const nonReminderStepsSelector = createSelector(
  ({ steps }) => filterFocus(steps, false),
  ({ people }) => people.allByOrg,
  mapSteps,
);
