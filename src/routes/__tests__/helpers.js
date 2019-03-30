import React from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { StackActions } from 'react-navigation';

import {
  wrapNextScreen,
  wrapNextScreenFn,
  wrapNextAction,
  wrapProps,
  buildTrackedScreen,
} from '../helpers';
import { renderWithRedux, snapshotWithRedux } from '../../../testUtils';

const store = configureStore([thunk])();

const nextScreenName = 'testNextScreenName';
const routeParams = { testKey: 'testValue' };

const TestComponent = connect()(({ next, dispatch }) => {
  dispatch(next(routeParams));
  return null;
});

beforeEach(() => {
  store.clearActions();
});

describe('wrapNextScreen', () => {
  it('should pass the next prop and fire a navigatePush action with the provided screen name', () => {
    const WrappedTestComponent = wrapNextScreen(TestComponent, nextScreenName);

    const { store } = renderWithRedux(<WrappedTestComponent />);

    expect(store.getActions()).toEqual([
      StackActions.push({
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

    const { store } = renderWithRedux(<WrappedTestComponent />);

    expect(store.getActions()).toEqual([
      StackActions.push({
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

    const { store } = renderWithRedux(<WrappedTestComponent />);

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
    const PropStringifyComponent = props => (
      <Text>{JSON.stringify(props)}</Text>
    );

    const WrappedTestComponent = wrapProps(PropStringifyComponent, {
      extraProp1: true,
      extraProp2: false,
    });

    snapshotWithRedux(<WrappedTestComponent />);
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
