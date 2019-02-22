import React, { Component } from 'react';
import { SafeAreaView } from 'react-navigation';

import { COLORS } from '../theme';

const RootSafeAreaViewContext = React.createContext({
  enabled: true,
  enableRootSafeAreaView: () => {},
});

export class RootSafeAreaView extends Component {
  state = {
    enabled: true,
    enableRootSafeAreaView: enabled => {
      this.setState({ enabled });
    },
  };

  render = () => (
    <RootSafeAreaViewContext.Provider value={this.state}>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: 'orange' /*COLORS.DARK_BLUE*/ }}
        forceInset={{
          ...(this.state.enabled
            ? {}
            : { top: 0, right: 0, bottom: 0, left: 0 }),
        }}
      >
        {this.props.children}
      </SafeAreaView>
    </RootSafeAreaViewContext.Provider>
  );
}

class DisableRootSafeAreaViewComponent extends Component {
  constructor(props) {
    super(props);
    props.enableRootSafeAreaView(false);
  }
  componentWillUnmount = () => {
    this.props.enableRootSafeAreaView(true);
  };

  render = () => null;
}

// There are prettier ways of doing this in newer React versions https://stackoverflow.com/q/49809884/665224
export const DisableRootSafeAreaView = () => (
  <RootSafeAreaViewContext.Consumer>
    {({ enableRootSafeAreaView }) => (
      <DisableRootSafeAreaViewComponent
        enableRootSafeAreaView={enableRootSafeAreaView}
      />
    )}
  </RootSafeAreaViewContext.Consumer>
);
