import { createSelector } from 'reselect';

const lastElement = array => array.slice(-1)[0];

const withoutLastElement = array => array.slice(0, -1);

const activeFlows = screenFlow => screenFlow.activeFlows;

export const currentFlow = createSelector(activeFlows, lastElement);

export const currentFlowName = createSelector(currentFlow, ({ flow }) => flow);

export const previousFlows = createSelector(activeFlows, withoutLastElement);

export const currentScreen = createSelector(currentFlow, ({ screens }) =>
  lastElement(screens),
);

export const currentScreenName = createSelector(
  currentScreen,
  ({ name }) => name,
);

export const previousScreens = createSelector(currentFlow, ({ screens }) =>
  withoutLastElement(screens),
);
