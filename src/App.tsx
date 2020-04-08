import React, { Component, Fragment } from 'react';
import { AppState, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { Provider as ProviderLegacy } from 'react-redux-legacy';
import { PersistGate } from 'redux-persist/integration/react';
import { ApolloProvider } from '@apollo/react-hooks';
import i18n from 'i18next';
import * as RNOmniture from 'react-native-omniture';
import DefaultPreference from 'react-native-default-preference';
import { Alert } from 'react-native';
// eslint-disable-next-line import/default
import codePush from 'react-native-code-push';
import Config from 'react-native-config';
import Icon from 'react-native-vector-icons/MaterialIcons';
import appsFlyer from 'react-native-appsflyer';

Icon.loadFont();

import './i18n';
import { rollbar } from './utils/rollbar.config';
import { store, persistor } from './store';
import { LOG } from './utils/logging';
import LoadingScreen from './containers/LoadingScreen';
import AppWithNavigationState from './AppNavigator';
import { codeLogin } from './actions/auth/anonymous';
import {
  EXPIRED_ACCESS_TOKEN,
  INVALID_ACCESS_TOKEN,
  INVALID_GRANT,
  NETWORK_REQUEST_FAILED,
} from './constants';
import { isAndroid } from './utils/common';
import { resetToInitialRoute } from './actions/navigationInit';
import { configureNotificationHandler } from './actions/notifications';
import { PlatformKeyboardAvoidingView } from './components/common';
import { setupFirebaseDynamicLinks } from './actions/deepLink';
import theme from './theme';
import { navigateToPostAuthScreen } from './actions/auth/auth';
import { apolloClient } from './apolloClient';
import { CollapsibleHeaderContext } from './components/CollapsibleTabHeader/useCollapsibleHeader';

appsFlyer.initSdk({
  devKey: 'QdbVaVHi9bHRchUTWtoaij',
  isDebug: __DEV__,
  appId: '447869440',
});

@codePush({
  deploymentKey: isAndroid
    ? Config.CODEPUSH_ANDROID_KEY
    : Config.CODEPUSH_IOS_KEY,
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
})
export default class App extends Component {
  showingErrorModal = false;
  state = {
    appState: AppState.currentState,
    collapsibleScrollViewProps: null,
  };

  constructor(props: Readonly<{}>) {
    super(props);
    this.initializeErrorHandling();
  }

  onBeforeLift = () => {
    this.checkOldAppToken();
    // @ts-ignore
    store.dispatch(resetToInitialRoute());
    // @ts-ignore
    store.dispatch(configureNotificationHandler());
    // @ts-ignore
    store.dispatch(setupFirebaseDynamicLinks());
    this.collectLifecycleData();
    AppState.addEventListener('change', this.handleAppStateChange);
  };

  checkOldAppToken() {
    const iOSKey = 'org.cru.missionhub.clientIdKey'; // key from the old iOS app
    const androidKey = 'account.guest.secret'; // key from the old android app

    const getKey = async (key: string) => {
      const value = await DefaultPreference.get(key);
      if (value) {
        try {
          // @ts-ignore
          await store.dispatch(codeLogin(value));
          // If we successfully logged in with the user's guest code, clear it out now
          DefaultPreference.clear(key);
          // @ts-ignore
          store.dispatch(navigateToPostAuthScreen());
        } catch (e) {
          // This happens when there is a problem with the code from the API call
          // We don't want to clear out the key here
        }
      }
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
    window.onunhandledrejection = ({ reason }: PromiseRejectionEvent) => {
      this.handleError(reason);
    };

    ErrorUtils.setGlobalHandler(this.handleError);
  }

  // eslint-disable-next-line complexity
  handleError(
    e: {
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      apiError?: any;
      key?: string;
      method?: string;
      endpoint?: string;
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      query?: any;
    } = {},
  ) {
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
        rollbar.error(
          Error(
            `API Error: ${e.key} ${(e.method || '').toUpperCase()} ${
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

  showAlert = (title: string, message: string) => {
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

  handleAppStateChange = (nextAppState: string) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this.collectLifecycleData();
      // https://github.com/AppsFlyerSDK/react-native-appsflyer/blob/master/Docs/API.md#trackAppLaunch
      if (!isAndroid) {
        appsFlyer.trackAppLaunch();
      }
    }

    this.setState({ appState: nextAppState });
  };

  collectLifecycleData() {
    RNOmniture.collectLifecycleData(store.getState().analytics);
  }

  render() {
    return (
      <Fragment>
        <StatusBar {...theme.statusBar.lightContent} />
        <ApolloProvider client={apolloClient}>
          <ProviderLegacy store={store}>
            <Provider store={store}>
              <PersistGate
                loading={<LoadingScreen />}
                onBeforeLift={this.onBeforeLift}
                persistor={persistor}
              >
                <CollapsibleHeaderContext.Provider
                  value={{
                    collapsibleScrollViewProps: this.state
                      .collapsibleScrollViewProps,
                    setCollapsibleScrollViewProps: collapsibleScrollViewProps =>
                      this.setState({ collapsibleScrollViewProps }),
                  }}
                >
                  {/* Wrap the whole navigation in a Keyboard avoiding view in order to fix issues with navigation */}
                  <PlatformKeyboardAvoidingView>
                    <AppWithNavigationState />
                  </PlatformKeyboardAvoidingView>
                </CollapsibleHeaderContext.Provider>
              </PersistGate>
            </Provider>
          </ProviderLegacy>
        </ApolloProvider>
      </Fragment>
    );
  }
}
