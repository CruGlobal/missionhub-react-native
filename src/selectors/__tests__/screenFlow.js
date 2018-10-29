import {
  currentFlow,
  currentFlowName,
  currentScreen,
  currentScreenName,
  previousFlows,
  previousScreens,
} from '../screenFlow';

const screenFlowState = {
  activeFlows: [
    { flow: 'First Flow', screens: [{ name: 'Screen 1' }] },
    { flow: 'Second Flow', screens: [{ name: 'Screen 2' }] },
    {
      flow: 'Third Flow',
      screens: [
        { name: 'Screen 3' },
        { name: 'Screen 4' },
        { name: 'Screen 5' },
      ],
    },
  ],
};

describe('currentFlow', () => {
  it('should return the current flow object', () => {
    expect(currentFlow(screenFlowState)).toEqual(
      screenFlowState.activeFlows[2],
    );
  });
});

describe('currentFlowName', () => {
  it('should return the current flow name', () => {
    expect(currentFlowName(screenFlowState)).toEqual(
      screenFlowState.activeFlows[2].flow,
    );
  });
});

describe('previousFlows', () => {
  it('should return an array of non-current flow objects', () => {
    expect(previousFlows(screenFlowState)).toEqual([
      screenFlowState.activeFlows[0],
      screenFlowState.activeFlows[1],
    ]);
  });
});

describe('currentScreen', () => {
  it('should return the current screen object', () => {
    expect(currentScreen(screenFlowState)).toEqual(
      screenFlowState.activeFlows[2].screens[2],
    );
  });
});

describe('currentScreenName', () => {
  it('should return the current screen name', () => {
    expect(currentScreenName(screenFlowState)).toEqual(
      screenFlowState.activeFlows[2].screens[2].name,
    );
  });
});

describe('previousScreens', () => {
  it('should return an array of previous screen objects in the current flow', () => {
    expect(previousScreens(screenFlowState)).toEqual([
      screenFlowState.activeFlows[2].screens[0],
      screenFlowState.activeFlows[2].screens[1],
    ]);
  });
});

/*

get latest flow
get latest screen
add new flow
add new screen
remove latest flow
remove latest flow

112233221122332211
 \  33  1122332211


const next = (payload, dispatch, getState) => {
  return ScreenName
  return { NewFlow, next(...) => {...} }
  return Done
}
const previous = (payload, dispatch, getState) => {
  return 0
  return 1
  return 2-inf
}

const next = async ({ payload, dispatch, getState, async startFlow, nextScreen, done })
 */
