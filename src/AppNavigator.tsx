import { connect } from 'react-redux-legacy';
import { createReduxContainer } from 'react-navigation-redux-helpers';
import React from 'react';
import { BackHandler } from 'react-native';

import { MainRoutes } from './AppRoutes';
import { navigateBack } from './actions/navigation';

const app = createReduxContainer(MainRoutes, 'root');

// @ts-ignore
const mapStateToProps = ({ nav }) => ({
  state: nav,
});

const appWithNavState = connect(mapStateToProps)(app);

export default connect(mapStateToProps)(backHandlerWrapper(appWithNavState));

// @ts-ignore
function backHandlerWrapper(WrappedComponent) {
  return class extends React.Component {
    componentDidMount() {
      BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }
    onBackPress = () => {
      // @ts-ignore
      const { dispatch, state } = this.props;
      if (state.index === 0) {
        return false;
      }
      dispatch(navigateBack());
      return true;
    };
    render() {
      return <WrappedComponent />;
    }
  };
}
