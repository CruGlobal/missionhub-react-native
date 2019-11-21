/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
//eslint-disable-next-line import/named
import { NavigationScreenComponent } from 'react-navigation';
import { NavigationStackOptions } from 'react-navigation-stack';

import { navigatePush } from '../actions/navigation';

interface AnyProps {
  [key: string]: any;
}

type NextAction = (props?: any) => ThunkAction<void, any, {}, AnyAction>;

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
