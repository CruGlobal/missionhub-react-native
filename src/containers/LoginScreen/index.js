import React, { Component } from 'react';
import { connect } from 'react-redux';

import { login, firstTime } from '../../actions/auth';
import styles from './styles';
import { Flex, Text, Button } from '../../components/common';
import {navigatePush} from '../../actions/navigation';
import projectStyles from '../../projectStyles';

class LoginScreen extends Component {
  login() {
    this.props.dispatch(login());
    this.navigateToNext();
  }

  tryItNow() {
    this.props.dispatch(firstTime());
    this.navigateToNext();
  }

  navigateToNext() {
    if (this.props.stageId) {
      this.props.dispatch(navigatePush('MainTabs'));
    } else {
      this.props.dispatch(navigatePush('Welcome'));
    }
  }

  render() {
    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <Text>MissionHub</Text>
        <Text style={projectStyles.primaryTextStyle}>Grow closer to God.</Text>
        <Text style={projectStyles.primaryTextStyle}>Help others experience Him.</Text>
        <Button
          onPress={() => console.log('join')}
          text="JOIN"
        />
        <Button
          onPress={() => this.login()}
          text="SIGN IN"
        />
        <Button
          onPress={() => this.tryItNow()}
          text="TRY IT NOW"
        />
      </Flex>
    );
  }
}

const mapStateToProps = ({myStageReducer}) => {
  return {
    stageId: myStageReducer.stageId,
  };
};

export default connect(mapStateToProps)(LoginScreen);
