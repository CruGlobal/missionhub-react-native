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

export function navigateBack(key = null) {
  return (dispatch) => {
    dispatch(NavigationActions.back({ key }));
  };
}

export function navigateReset(screen) {
  return (dispatch) => {
    dispatch(NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: screen }),
      ],
    }));
  };
}

// The reset home and reset login are handled by the login/logout auth actions