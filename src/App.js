import React, { Component } from 'react';
import { AppState } from 'react-native';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import * as RNOmniture from 'react-native-omniture';
import DefaultPreference from 'react-native-default-preference';
import { Alert } from 'react-native';

import i18n from './i18n';

import { Crashlytics } from 'react-native-fabric';

import './utils/reactotron'; // This needs to be before the store
import './utils/globals';

import LoadingScreen from './containers/LoadingScreen';

import getStore from './store';

import AppWithNavigationState from './AppNavigator';
import { updateAnalyticsContext } from './actions/analytics';
import { codeLogin, logout } from './actions/auth';
import {
  ANALYTICS, EXPIRED_ACCESS_TOKEN, INVALID_ACCESS_TOKEN, INVALID_GRANT, INVALID_TOKEN,
  NETWORK_REQUEST_FAILED,
} from './constants';
import { isAndroid } from './utils/common';

// TODO: Add loading stuff with redux persist
class App extends Component {
  showingErrorModal = false;

  state = {
    store: null,
    appState: AppState.currentState,
  };

  constructor(props) {
    super(props);

    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  componentWillMount() {
    getStore((store) => {
      this.setState({ store });
      this.checkOldAppToken();
    });
  }

  componentDidMount() {
    this.initializeAnalytics();
    this.initializeErrorHandling();
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  checkOldAppToken() {
    const iOSKey = 'org.cru.missionhub.clientIdKey'; // key from the old iOS app
    const androidKey = 'account.guest.secret'; // key from the old android app

    const getKey = (key) => {
      DefaultPreference.get(key).then((value) => {
        if (value) {
          this.state.store.dispatch(codeLogin(value)).then(() => {
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
    if (this.state && this.state.store) {
      this.collectLifecycleData();

      this.dispatchAnalyticsContextUpdate({ [ANALYTICS.CONTENT_LANGUAGE]: i18n.language });

      RNOmniture.loadMarketingCloudId((result) => {
        const updatedContext = { [ANALYTICS.MCID]: result };
        this.dispatchAnalyticsContextUpdate(updatedContext);
      });
    }
    else {
      setTimeout(this.initializeAnalytics.bind(this), 50);
    }
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
      if (apiError.errors && (apiError.errors[0].detail === EXPIRED_ACCESS_TOKEN || apiError.errors[0].detail === INVALID_ACCESS_TOKEN)) {
        return;
      } else if (apiError.error === INVALID_GRANT) {
        this.state.store.dispatch(logout(true));
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
    this.state.store.dispatch(updateAnalyticsContext(context));
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange(nextAppState) {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.collectLifecycleData();
    }

    this.setState({ appState: nextAppState });
  }

  collectLifecycleData() {
    if (this.state.store) {
      RNOmniture.collectLifecycleData(this.state.store.getState().analytics);
    }
  }

  render() {
    if (!this.state.store) {
      return <LoadingScreen />;
    }

    return (
      <Provider store={this.state.store}>
        <I18nextProvider i18n={ i18n }>
          <AppWithNavigationState />
        </I18nextProvider>
      </Provider>
    );
  }
}

export default App;
