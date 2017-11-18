import React, { Component } from 'react';
import { connect } from 'react-redux';
import { navigatePush } from '../../actions/navigation';

import styles from './styles';
import { Flex, Text, Button } from '../../components/common';

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
        <Text type="header" style={styles.headerText}>welcome!</Text>
        <Text style={styles.descriptionText}>Growing closer to God involves helping others experience Him. MissionHub joins you in that journey by suggesting steps of faith to take with others.</Text>
        <Flex style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
          <Button
            type="secondary"
            onPress={() => this.navigateToNext()}
            text="OK"
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
