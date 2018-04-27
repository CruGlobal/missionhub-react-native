import { NavigationActions } from 'react-navigation';

// Performance issues: https://github.com/react-community/react-navigation/issues/608#issuecomment-328635042

export function navigatePush(screen, props = {}) {
  return (dispatch) => {
    dispatch(NavigationActions.navigate({
      routeName: screen,
      params: props,
    }));
  };
}

export function navigateBack(times, backParams) {
  return (dispatch) => {
    if (times && times > 1) {
      dispatch(NavigationActions.pop({ n: times, immediate: true }));
    } else {
      // backParams can contain { key: string, immediate: bool }
      dispatch(NavigationActions.back(backParams));
    }
  };
}

export function navigateReset(screen, props = {}) {
  return (dispatch) => {
    dispatch(NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: screen, params: props }),
      ],
    }));
  };
}

// The reset home and reset login are handled by the login/logout auth actions
