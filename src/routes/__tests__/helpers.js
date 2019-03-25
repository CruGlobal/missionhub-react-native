import React from 'react';
import { connect } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { NavigationActions } from 'react-navigation';

import {
  wrapNextScreen,
  wrapNextScreenFn,
  wrapNextAction,
  wrapProps,
  buildTrackedScreen,
} from '../helpers';
import { renderShallow, testSnapshotShallow } from '../../../testUtils';

const store = configureStore([thunk])();

const nextScreenName = 'testNextScreenName';
const routeParams = { testKey: 'testValue' };

const TestComponent = connect()(({ next, dispatch }) =>
  dispatch(next(routeParams)),
);

beforeEach(() => {
  store.clearActions();
});

describe('wrapNextScreen', () => {
  it('should pass the next prop and fire a navigatePush action with the provided screen name', () => {
    const WrappedTestComponent = wrapNextScreen(TestComponent, nextScreenName);

    renderShallow(<WrappedTestComponent />, store).dive();

    expect(store.getActions()).toEqual([
      NavigationActions.navigate({
        routeName: nextScreenName,
        params: routeParams,
      }),
    ]);
  });
});

describe('wrapNextScreenFn', () => {
  it('should pass the next prop and fire a navigatePush action with the screen name provided by a function', () => {
    const WrappedTestComponent = wrapNextScreenFn(
      TestComponent,
      () => nextScreenName,
    );

    renderShallow(<WrappedTestComponent />, store).dive();

    expect(store.getActions()).toEqual([
      NavigationActions.navigate({
        routeName: nextScreenName,
        params: routeParams,
      }),
    ]);
  });
});

describe('wrapNextAction', () => {
  it('should pass the next prop and fire the custom action', () => {
    const WrappedTestComponent = wrapNextAction(
      TestComponent,
      props => dispatch => dispatch({ type: 'test', nextScreenName, props }),
    );

    renderShallow(<WrappedTestComponent />, store).dive();

    expect(store.getActions()).toEqual([
      {
        type: 'test',
        nextScreenName,
        props: routeParams,
      },
    ]);
  });
});

describe('wrapProps', () => {
  it('should add extra props to component', () => {
    const WrappedTestComponent = wrapProps(TestComponent, {
      extraProp1: true,
      extraProp2: false,
    });

    testSnapshotShallow(<WrappedTestComponent />, store);
  });
});

describe('buildTrackedScreen', () => {
  it('should convert function params into an object', () => {
    expect(
      buildTrackedScreen('screen', 'tracking', 'navigationOptions'),
    ).toEqual({
      screen: 'screen',
      tracking: 'tracking',
      navigationOptions: 'navigationOptions',
    });
  });
});
