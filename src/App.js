import React, { Component, Fragment } from 'react';
import { AppState, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import i18n from 'i18next';
import * as RNOmniture from 'react-native-omniture';
import DefaultPreference from 'react-native-default-preference';
import { Alert } from 'react-native';
// eslint-disable-next-line import/default
import codePush from 'react-native-code-push';
import Config from 'react-native-config';

import './i18n';
import { rollbar } from './utils/rollbar.config';
import { store, persistor } from './store';
import './utils/globals';
import LoadingScreen from './containers/LoadingScreen';
import AppWithNavigationState from './AppNavigator';
import { codeLogin } from './actions/auth';
import {
  EXPIRED_ACCESS_TOKEN,
  INVALID_ACCESS_TOKEN,
  INVALID_GRANT,
  NETWORK_REQUEST_FAILED,
} from './constants';
import { isAndroid } from './utils/common';
import { initialRoute } from './actions/navigationInit';
import { navigateReset } from './actions/navigation';
import { configureNotificationHandler } from './actions/notifications';
import { PlatformKeyboardAvoidingView } from './components/common';
import { setupFirebaseDynamicLinks } from './actions/deepLink';
import { COLORS } from './theme';

import { PersistGate } from 'redux-persist/integration/react';

@codePush({
  deploymentKey: isAndroid
    ? Config.CODEPUSH_ANDROID_KEY
    : Config.CODEPUSH_IOS_KEY,
})
export default class App extends Component {
  showingErrorModal = false;
  state = {
    appState: AppState.currentState,
  };

  constructor(props) {
    super(props);
    this.initializeErrorHandling();
  }

  onBeforeLift = () => {
    this.checkOldAppToken();
    store.dispatch(navigateReset(initialRoute(store.getState())));
    store.dispatch(configureNotificationHandler());
    store.dispatch(setupFirebaseDynamicLinks());
    this.collectLifecycleData();
    AppState.addEventListener('change', this.handleAppStateChange);
  };

  checkOldAppToken() {
    const iOSKey = 'org.cru.missionhub.clientIdKey'; // key from the old iOS app
    const androidKey = 'account.guest.secret'; // key from the old android app

    const getKey = key => {
      DefaultPreference.get(key).then(value => {
        if (value) {
          store
            .dispatch(codeLogin(value))
            .then(() => {
              // If we successfully logged in with the user's guest code, clear it out now
              DefaultPreference.clear(key);
            })
            .catch(() => {
              // This happens when there is a problem with the code from the API call
              // We don't want to clear out the key here
            });
        }
      });
    };
    if (isAndroid) {
      DefaultPreference.setName('com.missionhub.accounts.AccountManager').then(
        () => {
          getKey(androidKey);
        },
      );
    } else {
      getKey(iOSKey);
    }
  }

  initializeErrorHandling() {
    window.onunhandledrejection = ({ reason }) => {
      this.handleError(reason);
    };

    ErrorUtils.setGlobalHandler(this.handleError);
  }

  handleError(e) {
    const { apiError } = e;

    if (apiError) {
      if (
        apiError.errors &&
        apiError.errors[0] &&
        apiError.errors[0].detail &&
        (apiError.errors[0].detail === EXPIRED_ACCESS_TOKEN ||
          apiError.errors[0].detail === INVALID_ACCESS_TOKEN)
      ) {
        return;
      } else if (apiError.error === INVALID_GRANT) {
        return;
      } else if (apiError.message === NETWORK_REQUEST_FAILED) {
        this.showOfflineAlert();
        return;
      } else {
        this.showApiErrorAlert(e.key);
        rollbar.error(
          Error(
            `API Error: ${e.key} ${e.method.toUpperCase()} ${
              e.endpoint
            }\n\nQuery Params:\n${JSON.stringify(
              e.query,
              null,
              2,
            )}\n\nResponse:\n${JSON.stringify(e.apiError, null, 2)}`,
          ),
        );
      }
    } else if (e instanceof Error) {
      rollbar.error(e);
    } else {
      rollbar.error(Error(`Unknown Error:\n${JSON.stringify(e, null, 2)}`));
    }

    LOG(e);
  }

  showOfflineAlert = () => {
    this.showAlert(
      i18n.t('offline:youreOffline'),
      i18n.t('offline:connectToInternet'),
    );
  };

  showApiErrorAlert = key => {
    const specificError = i18n.t([
      `error:${key}`,
      'error:unexpectedErrorMessage',
    ]);
    const errorMessage = `${specificError} ${i18n.t('error:baseErrorMessage')}`;

    this.showAlert(i18n.t('error:error'), errorMessage);
  };

  showAlert = (title, message) => {
    if (!this.showingErrorModal) {
      this.showingErrorModal = true;

      const buttons = [
        { text: i18n.t('ok'), onPress: () => (this.showingErrorModal = false) },
      ];
      Alert.alert(title, message, buttons, {
        onDismiss: () => (this.showingErrorModal = false),
      });
    }
  };

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this.collectLifecycleData();
    }

    this.setState({ appState: nextAppState });
  };

  collectLifecycleData() {
    RNOmniture.collectLifecycleData(store.getState().analytics);
  }

  render() {
    return (
      <Fragment>
        <StatusBar
          backgroundColor={COLORS.DARK_BLUE}
          barStyle="light-content"
        />
        <Provider store={store}>
          <PersistGate
            loading={<LoadingScreen />}
            onBeforeLift={this.onBeforeLift}
            persistor={persistor}
          >
            {/* Wrap the whole navigation in a Keyboard avoiding view in order to fix issues with navigation */}
            <PlatformKeyboardAvoidingView>
              <AppWithNavigationState />
            </PlatformKeyboardAvoidingView>
          </PersistGate>
        </Provider>
      </Fragment>
    );
  }
}
