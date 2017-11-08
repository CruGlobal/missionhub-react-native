import React, { Component } from 'react';
import { connect } from 'react-redux';
import { navigatePush, navigateBack } from '../../actions/navigation';
import {Image} from 'react-native';

import styles from './styles';
import { Flex, Text, Button } from '../../components/common';
import projectStyles from '../../projectStyles';

class GetStartedScreen extends Component {
  render() {
    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <Flex style={{position: 'absolute', top: 0, left: 0}}>
          <Button style={{borderWidth: 0}} onPress={() => this.props.dispatch(navigateBack())}>
            <Image source={require('../../../assets/images/back_arrow.png')} />
          </Button>
        </Flex>

        <Text style={[projectStyles.primaryHeaderStyle, {fontSize: 48}]}>hi {this.props.firstName.toLowerCase()}!</Text>
        <Text style={projectStyles.primaryTextStyle}>While everyone's spiritual journey is unique, many people progress through a five stage journey toward God.</Text>
        <Text style={projectStyles.primaryTextStyle}>Let's figure out where you are on your journey.</Text>

        <Flex style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
          <Button
            type="header"
            onPress={() => this.props.dispatch(navigatePush('Stage'))}
            text="LET'S GET STARTED"
            style={projectStyles.primaryButtonStyle}
            buttonTextStyle={projectStyles.primaryButtonTextStyle}
          />
        </Flex>
      </Flex>
    );
  }
}

const mapStateToProps = ({profile}, { navigation }) => ({
  id: navigation.state.params ? navigation.state.params.id : '',
  firstName: profile.firstName,
});

export default connect(mapStateToProps)(GetStartedScreen);
