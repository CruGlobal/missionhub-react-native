import { NavigationActions, StackActions } from 'react-navigation';

jest.mock('react-navigation', () => ({
  NavigationActions: {
    navigate: jest.fn(),
    back: jest.fn(),
  },
  StackActions: {
    pop: jest.fn(),
    reset: jest.fn(),
    replace: jest.fn(),
  },
}));
import {
  navigatePush,
  navigateBack,
  navigateReset,
  navigateReplace,
  navigateNestedReset,
} from '../navigation';

const routeName = 'screenName';
const params = { prop1: 'value1' };

describe('navigatePush', () => {
  it('should push new screen onto the stack', () => {
    navigatePush(routeName, params)(jest.fn());
    expect(NavigationActions.navigate).toHaveBeenCalledWith({
      routeName,
      params,
    });
  });
  it('should push new screen onto the stack with no props', () => {
    navigatePush(routeName)(jest.fn());
    expect(NavigationActions.navigate).toHaveBeenCalledWith({
      routeName,
      params,
    });
  });
});

describe('navigateBack', () => {
  it('should navigate back once', () => {
    navigateBack()(jest.fn());
    expect(NavigationActions.back).toHaveBeenCalledWith();
  });
  it('should navigate back multiple times', () => {
    navigateBack(5)(jest.fn());
    expect(StackActions.pop).toHaveBeenCalledWith({ n: 5, immediate: true });
  });
});

describe('navigateReset', () => {
  it('should reset navigation stack', () => {
    NavigationActions.navigate.mockReturnValue('newRouterState');
    navigateReset(routeName, params)(jest.fn());
    expect(NavigationActions.navigate).toHaveBeenCalledWith({
      routeName,
      params,
    });
    expect(StackActions.reset).toHaveBeenCalledWith({
      index: 0,
      actions: ['newRouterState'],
    });
  });
  it('should reset navigation stack with no props', () => {
    NavigationActions.navigate.mockReturnValue('newRouterState');
    navigateReset(routeName)(jest.fn());
    expect(NavigationActions.navigate).toHaveBeenCalledWith({
      routeName,
      params,
    });
    expect(StackActions.reset).toHaveBeenCalledWith({
      index: 0,
      actions: ['newRouterState'],
    });
  });
});

describe('navigateNestedReset', () => {
  const screen1 = 'roger';
  const screen2 = 'the dummy';

  it('should reset to a nested navigate stack', () => {
    NavigationActions.navigate.mockImplementation(({ routeName }) => ({
      routeName,
    }));

    navigateNestedReset(screen1, screen2)(jest.fn());

    expect(StackActions.reset).toHaveBeenCalledWith({
      index: 1,
      actions: [{ routeName: screen1 }, { routeName: screen2 }],
    });
  });
});

describe('navigateReplace', () => {
  it('should replace last route in navigation stack', () => {
    navigateReplace(routeName, params)(jest.fn());
    expect(StackActions.replace).toHaveBeenCalledWith({
      routeName,
      params,
      immediate: true,
    });
  });
});
