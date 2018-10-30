import { createSelector } from 'reselect';

const lastElement = array => array.slice(-1)[0];
const secondToLastElement = array => array.slice(-2, -1)[0];

const withoutLastElement = array => array.slice(0, -1);

const screens = screenFlow => screenFlow.screens;

export const activeScreenConfig = createSelector(screens, lastElement);
export const activeFlowName = createSelector(
  activeScreenConfig,
  ({ flow }) => flow,
);
export const activeScreenName = createSelector(
  activeScreenConfig,
  ({ screen }) => screen,
);

export const previousScreens = createSelector(screens, withoutLastElement);

/*
 Use array of screens to create a stack of screen objects,
 keeping only the last sequential object with the same flow name (so we know the last active screen of that flow),
 popping if the second to last flow is the one we are going to next (finished current flow)
 pushing if it is not (new flow started)
 then grab the second to last

 LIMITATION: Can't nest flows with the same name inside each other
*/
export const previousFlow = createSelector(screens, screens =>
  secondToLastElement(
    screens.reduce(
      (flows, currentScreenObj) =>
        (lastElement(flows) || {}).flow === currentScreenObj.flow
          ? [...withoutLastElement(flows), currentScreenObj]
          : (secondToLastElement(flows) || {}).flow === currentScreenObj.flow
            ? withoutLastElement(flows)
            : [...flows, currentScreenObj],
      [],
    ),
  ),
);
