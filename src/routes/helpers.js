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
export const wrapNextAction = (WrappedComponent, nextAction, extraProps = {}) =>
  wrapProps(WrappedComponent, {
    ...extraProps,
    next: nextAction,
  });
const wrapProps = (WrappedComponent, extraProps = {}) => props => (
  <WrappedComponent {...props} {...extraProps} />
);
