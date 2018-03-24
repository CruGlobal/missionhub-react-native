import { NavigationActions, StackActions } from 'react-navigation';

jest.mock('react-navigation', () => ({
  NavigationActions: {
    navigate: jest.fn(),
    back: jest.fn(),
  },
  StackActions: {
    pop: jest.fn(),
    reset: jest.fn(),
  },
}));
import {
  navigatePush,
  navigateBack,
  navigateReset,
} from '../../src/actions/navigation';

describe('navigatePush', () => {
  it('should push new screen onto the stack', () => {
    navigatePush('screenName', { prop1: 'value1' })(jest.fn());
    expect(NavigationActions.navigate).toHaveBeenCalledWith({
      routeName: 'screenName',
      params: { prop1: 'value1' },
    });
  });
  it('should push new screen onto the stack with no props', () => {
    navigatePush('screenName')(jest.fn());
    expect(NavigationActions.navigate).toHaveBeenCalledWith({
      routeName: 'screenName',
      params: {},
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
    navigateReset('screenName', { prop1: 'value1' })(jest.fn());
    expect(NavigationActions.navigate).toHaveBeenCalledWith({
      routeName: 'screenName',
      params: { prop1: 'value1' },
    });
    expect(StackActions.reset).toHaveBeenCalledWith({
      index: 0,
      actions: ['newRouterState'],
    });
  });
  it('should reset navigation stack with no props', () => {
    NavigationActions.navigate.mockReturnValue('newRouterState');
    navigateReset('screenName')(jest.fn());
    expect(NavigationActions.navigate).toHaveBeenCalledWith({
      routeName: 'screenName',
      params: {},
    });
    expect(StackActions.reset).toHaveBeenCalledWith({
      index: 0,
      actions: ['newRouterState'],
    });
  });
});
