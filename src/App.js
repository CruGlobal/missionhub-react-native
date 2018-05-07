import React, { Component } from 'react';
import { AppState } from 'react-native';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import * as RNOmniture from 'react-native-omniture';
import DefaultPreference from 'react-native-default-preference';
import { Alert } from 'react-native';
// eslint-disable-next-line import/default
import codePush from 'react-native-code-push';
import Config from 'react-native-config';
import { Crashlytics } from 'react-native-fabric';

import { store, persistor } from './store';
import i18n from './i18n';
import './utils/globals';
import LoadingScreen from './containers/LoadingScreen';
import AppWithNavigationState from './AppNavigator';
import { updateAnalyticsContext } from './actions/analytics';
import { codeLogin } from './actions/auth';
import { ANALYTICS, EXPIRED_ACCESS_TOKEN, INVALID_GRANT, NETWORK_REQUEST_FAILED } from './constants';
import { isAndroid } from './utils/common';
import { initialRoute } from './actions/navigationInit';
import { navigateReset } from './actions/navigation';
import { configureNotificationHandler } from './actions/notifications';

import { PersistGate } from 'redux-persist/integration/react';

@codePush({ deploymentKey: isAndroid ? Config.CODEPUSH_ANDROID_KEY : Config.CODEPUSH_IOS_KEY })
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
    this.initializeAnalytics();
    AppState.addEventListener('change', this.handleAppStateChange);
  };

  checkOldAppToken() {
    const iOSKey = 'org.cru.missionhub.clientIdKey'; // key from the old iOS app
    const androidKey = 'account.guest.secret'; // key from the old android app

    const getKey = (key) => {
      DefaultPreference.get(key).then((value) => {
        if (value) {
          store.dispatch(codeLogin(value)).then(() => {
            // If we successfully logged in with the user's guest code, clear it out now
            DefaultPreference.clear(key);
          }).catch(() => {
            // This happens when there is a problem with the code from the API call
            // We don't want to clear out the key here
          });
        }
      });
    };
    if (isAndroid) {
      DefaultPreference.setName('com.missionhub.accounts.AccountManager').then(() => {
        getKey(androidKey);
      });
    } else {
      getKey(iOSKey);
    }
  }

  initializeAnalytics() { //TODO add tests
    this.collectLifecycleData();

    this.dispatchAnalyticsContextUpdate({ [ANALYTICS.CONTENT_LANGUAGE]: i18n.language });

    RNOmniture.loadMarketingCloudId((result) => {
      const updatedContext = { [ANALYTICS.MCID]: result };
      this.dispatchAnalyticsContextUpdate(updatedContext);
    });
  }

  initializeErrorHandling() {
    window.onunhandledrejection = ({ reason }) => {
      this.handleError(reason);
    };

    ErrorUtils.setGlobalHandler(this.handleError);
  }

  handleError(e) {
    let crashlyticsError;
    const { apiError } = e;

    if (apiError) {
      if (apiError.error === INVALID_GRANT || (apiError.errors && apiError.errors[0].detail === EXPIRED_ACCESS_TOKEN)) {
        return;
      } else if (apiError.message === NETWORK_REQUEST_FAILED) {
        this.showOfflineAlert();

      } else {
        this.showApiErrorAlert(e.key);
        crashlyticsError = {
          title: `API Error: ${e.key} ${e.method.toUpperCase()} ${e.endpoint}`,
          message: `\n\nQuery Params:\n${JSON.stringify(e.query, null, 2)}\n\nResponse:\n${JSON.stringify(e.apiError, null, 2)}`,
        };
      }

    } else {
      crashlyticsError = {
        title: e.message.split('\n')[ 0 ],
        message: e.message,
      };
    }

    if (crashlyticsError) {
      LOG(e);

      if (!__DEV__) {
        Crashlytics.recordCustomExceptionName(crashlyticsError.title, crashlyticsError.message, []);
      }
    }
  }

  showOfflineAlert = () => {
    this.showAlert(i18n.t('offline:youreOffline'), i18n.t('offline:connectToInternet'));
  };

  showApiErrorAlert = (key) => {
    const specificError = i18n.t([ `error:${key}`, 'error:unexpectedErrorMessage' ]);
    const errorMessage = `${specificError} ${i18n.t('error:baseErrorMessage')}`;

    this.showAlert(i18n.t('error:error'), errorMessage);
  };

  showAlert = (title, message) => {
    if (!this.showingErrorModal) {
      this.showingErrorModal = true;

      const buttons = [ { text: i18n.t('ok'), onPress: () => this.showingErrorModal = false } ];
      Alert.alert(title, message, buttons, { onDismiss: () => this.showingErrorModal = false });
    }
  };

  dispatchAnalyticsContextUpdate(context) {
    store.dispatch(updateAnalyticsContext(context));
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.collectLifecycleData();
    }

    this.setState({ appState: nextAppState });
  };

  collectLifecycleData() {
    RNOmniture.collectLifecycleData(store.getState().analytics);
  }

  render() {
    return (
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <PersistGate
            loading={<LoadingScreen />}
            onBeforeLift={this.onBeforeLift}
            persistor={persistor}>
            <AppWithNavigationState />
          </PersistGate>
        </I18nextProvider>
      </Provider>
    );
  }
}
