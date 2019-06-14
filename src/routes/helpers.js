import React from 'react';

import { navigatePush } from '../actions/navigation';

export const wrapNextScreen = (WrappedComponent, nextScreen, extraProps = {}) =>
  wrapNextScreenFn(WrappedComponent, () => nextScreen, extraProps);

export const wrapNextScreenFn = (WrappedComponent, fn, extraProps = {}) =>
  wrapNextAction(
    WrappedComponent,
    props => navigatePush(fn(props), props),
    extraProps,
  );

export const wrapNextAction = (
  WrappedComponent,
  nextAction,
  extraProps = {},
) => {
  return wrapProps(WrappedComponent, {
    ...extraProps,
    next: nextAction,
  });
};

export const wrapProps = (WrappedComponent, extraProps = {}) => props => (
  <WrappedComponent {...props} {...extraProps} />
);

export const buildTrackedScreen = (screen, tracking, navigationOptions) => {
  return {
    screen,
    tracking,
    navigationOptions,
  };
};
