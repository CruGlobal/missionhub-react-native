import { NavigationActions, StackActions } from 'react-navigation';

// Performance issues: https://github.com/react-community/react-navigation/issues/608#issuecomment-328635042

export function navigatePush(screen, props = {}) {
  return dispatch => {
    dispatch(
      NavigationActions.navigate({
        routeName: screen,
        params: props,
      }),
    );
  };
}

export function navigateBack(times) {
  return dispatch => {
    if (times && times > 1) {
      dispatch(StackActions.pop({ n: times, immediate: true }));
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
        actions: [
          NavigationActions.navigate({ routeName: screen, params: props }),
        ],
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
