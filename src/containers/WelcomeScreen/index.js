import React, { Component } from 'react';
import { connect } from 'react-redux';
import { navigatePush } from '../../actions/navigation';
import theme from '../../theme';

import styles from './styles';
import { Flex, Text, Button } from '../../components/common';
import BackButton from '../BackButton';

class WelcomeScreen extends Component {
  navigateToNext() {
    if (this.props.auth.isLoggedIn) {
      this.props.dispatch(navigatePush('GetStarted'));
    } else {
      this.props.dispatch(navigatePush('Setup'));
    }
  }

  render() {
    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <BackButton />
        <Flex value={4} align="center" justify="center">
          <Text type="header" style={styles.headerText}>welcome!</Text>
          <Text style={styles.descriptionText}>Growing closer to God involves helping others experience Him. MissionHub joins you in that journey by suggesting steps of faith to take with others.</Text>
        </Flex>
        <Flex value={1} align="stretch" justify="end">
          <Button
            type="secondary"
            onPress={() => this.navigateToNext()}
            text="OK"
            style={{width: theme.fullWidth}}
          />
        </Flex>
      </Flex>
    );
  }
}

const mapStateToProps = ({auth}) => ({
  auth: auth,
});

export default connect(mapStateToProps)(WelcomeScreen);
