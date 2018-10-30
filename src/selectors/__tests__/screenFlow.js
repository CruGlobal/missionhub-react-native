import {
  activeScreenConfig,
  activeFlowName,
  activeScreenName,
  previousScreens,
  previousFlow,
} from '../screenFlow';

const screenFlowState = {
  screens: [
    { flow: 'Flow 1', screen: 'Screen 1' },
    { flow: 'Flow 1', screen: 'Screen 2' },
    { flow: 'Flow 2', screen: 'Screen 1' },
    { flow: 'Flow 3', screen: 'Screen 1' },
    { flow: 'Flow 2', screen: 'Screen 2' },
  ],
};

describe('activeScreenConfig', () => {
  it('should return the current screen object', () => {
    expect(activeScreenConfig(screenFlowState)).toEqual(
      screenFlowState.screens[4],
    );
  });
});

describe('activeFlowName', () => {
  it('should return the current flow name', () => {
    expect(activeFlowName(screenFlowState)).toEqual(
      screenFlowState.screens[4].flow,
    );
  });
});

describe('activeScreenName', () => {
  it('should return the current screen name', () => {
    expect(activeScreenName(screenFlowState)).toEqual(
      screenFlowState.screens[4].screen,
    );
  });
});

describe('previousScreens', () => {
  it('should return an array of non-current screen objects', () => {
    expect(previousScreens(screenFlowState)).toEqual([
      screenFlowState.screens[0],
      screenFlowState.screens[1],
      screenFlowState.screens[2],
      screenFlowState.screens[3],
    ]);
  });
});

describe('previousFlow', () => {
  it('should return undefined when there is no active flow', () => {
    expect(previousFlow({ screens: [] })).toBeUndefined();
  });
  it('should return undefined when there is only one screen', () => {
    expect(
      previousFlow({ screens: [{ flow: 'Flow 1', screen: 'Screen 1' }] }),
    ).toBeUndefined();
  });
  it('should return undefined when there is only one flow', () => {
    expect(
      previousFlow({
        screens: [
          { flow: 'Flow 1', screen: 'Screen 1' },
          { flow: 'Flow 1', screen: 'Screen 2' },
          { flow: 'Flow 1', screen: 'Screen 3' },
          { flow: 'Flow 1', screen: 'Screen 4' },
          { flow: 'Flow 1', screen: 'Screen 5' },
          { flow: 'Flow 1', screen: 'Screen 6' },
        ],
      }),
    ).toBeUndefined();
  });
  it('should return the last screen object of the previous flow', () => {
    expect(previousFlow(screenFlowState)).toEqual(screenFlowState.screens[1]);
  });
  it('should return the last screen object of the previous flow when the same 2nd level flow is reused multiple times', () => {
    expect(
      previousFlow({
        screens: [
          { flow: 'Flow 1', screen: 'Screen 1' },
          { flow: 'Flow 1', screen: 'Screen 2' },
          { flow: 'Flow 2', screen: 'Screen 1' },
          { flow: 'Flow 2', screen: 'Screen 2' },
          { flow: 'Flow 1', screen: 'Screen 3' },
          { flow: 'Flow 1', screen: 'Screen 4' },
          { flow: 'Flow 2', screen: 'Screen 3' },
          { flow: 'Flow 2', screen: 'Screen 4' },
        ],
      }),
    ).toEqual({ flow: 'Flow 1', screen: 'Screen 4' });
  });
  it('should return the last screen object of the previous flow when there are deeply nested flows', () => {
    expect(
      previousFlow({
        screens: [
          { flow: 'Flow 1', screen: 'Screen 1' },
          { flow: 'Flow 1', screen: 'Screen 2' },
          { flow: 'Flow 2', screen: 'Screen 1' },
          { flow: 'Flow 3', screen: 'Screen 1' },
          { flow: 'Flow 2', screen: 'Screen 2' },
          { flow: 'Flow 1', screen: 'Screen 3' },
          { flow: 'Flow 1', screen: 'Screen 4' },
          { flow: 'Flow 2', screen: 'Screen 3' },
          { flow: 'Flow 3', screen: 'Screen 1' },
          { flow: 'Flow 2', screen: 'Screen 4' },
        ],
      }),
    ).toEqual({ flow: 'Flow 1', screen: 'Screen 4' });
  });
  it("should return the last screen object of the previous flow when the previous flow isn't at the root", () => {
    expect(
      previousFlow({
        screens: [
          { flow: 'Flow 1', screen: 'Screen 1' },
          { flow: 'Flow 1', screen: 'Screen 2' },
          { flow: 'Flow 2', screen: 'Screen 1' },
          { flow: 'Flow 3', screen: 'Screen 1' },
          { flow: 'Flow 2', screen: 'Screen 2' },
          { flow: 'Flow 1', screen: 'Screen 3' },
          { flow: 'Flow 1', screen: 'Screen 4' },
          { flow: 'Flow 2', screen: 'Screen 3' },
          { flow: 'Flow 3', screen: 'Screen 1' },
        ],
      }),
    ).toEqual({ flow: 'Flow 2', screen: 'Screen 3' });
  });
  it('should return the last screen object of the previous flow when it is way back in history', () => {
    expect(
      previousFlow({
        screens: [
          { flow: 'Flow 1', screen: 'Screen 1' },
          { flow: 'Flow 1', screen: 'Screen 2' },
          { flow: 'Flow 2', screen: 'Screen 1' },
          { flow: 'Flow 2', screen: 'Screen 2' },
          { flow: 'Flow 2', screen: 'Screen 3' },
          { flow: 'Flow 2', screen: 'Screen 4' },
          { flow: 'Flow 2', screen: 'Screen 5' },
        ],
      }),
    ).toEqual({ flow: 'Flow 1', screen: 'Screen 2' });
  });
  it('should return undefined when the root flow is active', () => {
    expect(
      previousFlow({
        screens: [
          { flow: 'Flow 1', screen: 'Screen 1' },
          { flow: 'Flow 1', screen: 'Screen 2' },
          { flow: 'Flow 2', screen: 'Screen 1' },
          { flow: 'Flow 3', screen: 'Screen 1' },
          { flow: 'Flow 2', screen: 'Screen 2' },
          { flow: 'Flow 1', screen: 'Screen 3' },
        ],
      }),
    ).toBeUndefined();
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

/*

get last
get last unique flow
remove last
add new

 */
