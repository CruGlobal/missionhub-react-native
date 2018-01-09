import React, { Component } from 'react';
// import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

import './utils/reactotron'; // This needs to be before the store
import './utils/globals';

import LoadingScreen from './containers/LoadingScreen';

import getStore from './store';

import * as RNOmniture from 'react-native-omniture';
import AppWithNavigationState from './AppNavigator';
import { updateAnalyticsContext } from './actions/analytics';
import { ANALYTICS } from './constants';

// TODO: Add loading stuff with redux persist
class App extends Component {
  state = { store: null };

  componentWillMount() {
    getStore((store) => this.setState({ store }));
  }

  render() {
    if (!this.state.store) {
      return <LoadingScreen />;
    }

    RNOmniture.loadMarketingCloudId((result) => {
      const analyticsContext = this.state.store.getState().analytics;
      analyticsContext[ANALYTICS.MCID] = result;

      this.state.store.dispatch(updateAnalyticsContext(analyticsContext));
    });

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
