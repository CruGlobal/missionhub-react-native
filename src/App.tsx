import React, { Component } from 'react';
import { StatusBar, Alert } from 'react-native';
import { Provider } from 'react-redux';
import { Provider as ProviderLegacy } from 'react-redux-legacy';
import { PersistGate } from 'redux-persist/integration/react';
import { ApolloProvider } from '@apollo/react-hooks';
import i18n from 'i18next';
import codePush from 'react-native-code-push';
import Config from 'react-native-config';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import 'moment/locale/es';
import 'moment/locale/tr';
import 'moment/locale/pt';
import 'moment/locale/nb';
import ApolloClient from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';

Icon.loadFont();

import './i18n';
import { rollbar } from './utils/rollbar.config';
import { store, persistor } from './store';
import { LOG } from './utils/logging';
import LoadingScreen from './containers/LoadingScreen';
import AppWithNavigationState from './AppNavigator';
import {
  EXPIRED_ACCESS_TOKEN,
  INVALID_ACCESS_TOKEN,
  INVALID_GRANT,
  NETWORK_REQUEST_FAILED,
} from './constants';
import { isAndroid } from './utils/common';
import { configureNotificationHandler } from './actions/notifications';
import { PlatformKeyboardAvoidingView } from './components/common';
import { setupFirebaseDynamicLinks } from './actions/deepLink';
import theme from './theme';
import { getFeatureFlags } from './actions/misc';
import { createApolloClient } from './apolloClient';
import { warmAuthCache } from './auth/authUtilities';
import { isAuthenticated } from './auth/authStore';
import { useProvideAuthRefresh } from './auth/provideAuthRefresh';

const RunAppHooks = () => {
  useProvideAuthRefresh();

  return null;
};

@codePush({
  deploymentKey: isAndroid
    ? Config.CODEPUSH_ANDROID_KEY
    : Config.CODEPUSH_IOS_KEY,
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
})
export default class App extends Component {
  showingErrorModal = false;
  state: {
    apolloClient?: ApolloClient<NormalizedCacheObject>;
  } = {
    apolloClient: undefined,
  };

  constructor(props: Readonly<Record<string, unknown>>) {
    super(props);
    this.initializeErrorHandling();
  }

  onBeforeLift = async () => {
    const apolloClient = await createApolloClient();
    this.setState({ apolloClient });
    await warmAuthCache();

    store.dispatch(configureNotificationHandler());
    store.dispatch(setupFirebaseDynamicLinks());
    isAuthenticated() && getFeatureFlags();
    moment.locale(i18n.language.split('-')[0]);
  };

  initializeErrorHandling() {
    window.onunhandledrejection = ({ reason }: PromiseRejectionEvent) => {
      this.handleError(reason);
    };

    ErrorUtils.setGlobalHandler(this.handleError);
  }

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

  render() {
    return (
      <>
        <StatusBar {...theme.statusBar.lightContent} />
        <ProviderLegacy store={store}>
          <Provider store={store}>
            <PersistGate
              // @ts-ignore
              testID="persistGate"
              loading={<LoadingScreen />}
              onBeforeLift={this.onBeforeLift}
              persistor={persistor}
            >
              {this.state.apolloClient ? (
                <ApolloProvider client={this.state.apolloClient}>
                  <RunAppHooks />
                  {/* Wrap the whole navigation in a Keyboard avoiding view in order to fix issues with navigation */}
                  <PlatformKeyboardAvoidingView>
                    <AppWithNavigationState />
                  </PlatformKeyboardAvoidingView>
                </ApolloProvider>
              ) : (
                <LoadingScreen />
              )}
            </PersistGate>
          </Provider>
        </ProviderLegacy>
      </>
    );
  }
}
