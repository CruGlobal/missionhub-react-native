import React, { Component } from 'react';
import { AppState } from 'react-native';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import * as RNOmniture from 'react-native-omniture';

import i18n from './i18n';

import './utils/reactotron'; // This needs to be before the store
import './utils/globals';

import LoadingScreen from './containers/LoadingScreen';

import getStore from './store';

import AppWithNavigationState from './AppNavigator';
import { updateAnalyticsContext } from './actions/analytics';
import { ANALYTICS } from './constants';

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
    getStore((store) => this.setState({ store }));
  }

  componentDidMount() {
    this.initializeAnalytics();
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  initializeAnalytics() { //TODO add tests
    if (this.state && this.state.store) {
      this.collectLifecycleData();

      RNOmniture.loadMarketingCloudId((result) => {
        const updatedContext = { [ANALYTICS.MCID]: result };
        this.state.store.dispatch(updateAnalyticsContext(updatedContext));
      });
    }
    else {
      setTimeout(this.initializeAnalytics.bind(this), 50);
    }
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
    RNOmniture.collectLifecycleData(this.state.store.getState().analytics);
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
