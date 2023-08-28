/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { NavigationScreenComponent } from 'react-navigation';
import { NavigationStackOptions } from 'react-navigation-stack';

import { navigatePush } from '../actions/navigation';
import { RootState } from '../reducers';

interface AnyProps {
  [key: string]: any;
}

export type NextAction = (
  props?: any,
) => ThunkAction<void, RootState, never, AnyAction>;

export const wrapNextScreen = (
  WrappedComponent: NavigationScreenComponent<any, any>,
  nextScreen: string,
  extraProps = {},
) => wrapNextScreenFn(WrappedComponent, () => nextScreen, extraProps);

export const wrapNextScreenFn = (
  WrappedComponent: NavigationScreenComponent<any, any>,
  fn: (props: AnyProps) => string,
  extraProps = {},
) =>
  wrapNextAction(
    WrappedComponent,
    (props: AnyProps) => navigatePush(fn(props), props),
    extraProps,
  );

export const wrapNextAction = (
  WrappedComponent: NavigationScreenComponent<any, any>,
  nextAction: NextAction,
  extraProps = {},
) =>
  wrapProps(WrappedComponent, {
    ...extraProps,
    next: nextAction,
  });

// eslint-disable-next-line import/no-unused-modules
export const wrapProps = (
  WrappedComponent: NavigationScreenComponent<any, any>,
  extraProps: AnyProps & { next?: NextAction } = {},
) => (props: AnyProps) => <WrappedComponent {...props} {...extraProps} />;

export const buildTrackedScreen = (
  screen: NavigationScreenComponent<any, any>,
  tracking?: {
    name: string;
    section: string;
    subsection?: string;
    level3?: string;
    level4?: string;
  },
  navigationOptions?: NavigationStackOptions,
) => {
  return {
    screen,
    tracking,
    navigationOptions,
  };
};
