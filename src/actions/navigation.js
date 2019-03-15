import { NavigationActions, StackActions } from 'react-navigation';

export function navigatePush(screen, props = {}) {
  return dispatch => {
    dispatch(
      StackActions.push({
        routeName: screen,
        params: props,
      }),
    );
  };
}

export function navigateBack(times, immediate = true) {
  return dispatch => {
    if (times && times > 1) {
      dispatch(StackActions.pop({ n: times, immediate }));
    } else {
      dispatch(NavigationActions.back());
    }
  };
}

export function navigateReset(screen, props = {}) {
  return dispatch => {
    dispatch(
      StackActions.reset({
        index: 0,
        key: null, // Reset root stack navigator
        actions: [
          NavigationActions.navigate({ routeName: screen, params: props }),
        ],
      }),
    );
  };
}

export function navigateNestedReset(...screens) {
  const actions = screens.reduce(
    (actionsAccumulator, routeName) =>
      actionsAccumulator.concat([NavigationActions.navigate({ routeName })]),
    [],
  );

  return dispatch => {
    dispatch(
      StackActions.reset({
        index: actions.length - 1,
        actions,
      }),
    );
  };
}

// The reset home and reset login are handled by the login/logout auth actions

export function navigateReplace(screen, props = {}) {
  return dispatch => {
    dispatch(
      StackActions.replace({
        routeName: screen,
        params: props,
        immediate: true,
      }),
    );
  };
}
