import React, { Component } from 'react';
import { AppState } from 'react-native';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import * as RNOmniture from 'react-native-omniture';
import DefaultPreference from 'react-native-default-preference';

import i18n from './i18n';

import Fabric from 'react-native-fabric';

import './utils/reactotron'; // This needs to be before the store
import './utils/globals';

import LoadingScreen from './containers/LoadingScreen';

import getStore from './store';

import AppWithNavigationState from './AppNavigator';
import { updateAnalyticsContext } from './actions/analytics';
import { codeLogin } from './actions/auth';
import { ANALYTICS } from './constants';
import { isAndroid } from './utils/common';

// TODO: Add loading stuff with redux persist
class App extends Component {
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
    ErrorUtils.setGlobalHandler(this.handleError); // eslint-disable-line no-undef
  }

  handleError(e) {
    var { Crashlytics } = Fabric;

    Crashlytics.log(e.message);
    Crashlytics.recordCustomExceptionName(e.message.split('\n')[0], e.message, []);
  }

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

// AppRegistry.registerComponent('App', () => App);

export default App;
