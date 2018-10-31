import { createSelector } from 'reselect';

const lastElement = array => array.slice(-1)[0];

const withoutLastNElements = (array, n) =>
  n > 0 ? array.slice(0, -1 * n) : array;

const screens = screenFlow => screenFlow.screens;

export const activeScreen = createSelector(screens, lastElement);

export const screensWithoutMostRecent = createSelector(
  screens,
  (_, number = 1) => number,
  withoutLastNElements,
);
