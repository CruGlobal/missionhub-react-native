import { connect } from 'react-redux';
import { reduxifyNavigator } from 'react-navigation-redux-helpers';
import React from 'react';
import { BackHandler } from 'react-native';

import { AppNavigator } from './routes';
import { navigateBack } from './actions/navigation';

const app = reduxifyNavigator(AppNavigator, 'root');

const mapStateToProps = ({ nav }) => ({
  state: nav,
});

const appWithNavState = connect(mapStateToProps)(app);

export default connect(mapStateToProps)(backHandlerWrapper(appWithNavState));

function backHandlerWrapper(WrappedComponent) {
  return class extends React.Component {
    componentDidMount() {
      BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }
    onBackPress = () => {
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
