import React, { Component } from 'react';
import { connect } from 'react-redux';
import { navigatePush, navigateBack } from '../../actions/navigation';

import styles from './styles';
import { Flex, Text, Button } from '../../components/common';
import projectStyles from '../../projectStyles';

class GetStartedScreen extends Component {
  render() {
    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <Flex style={{position: 'absolute', top: 0, left: 0}}>
          <Button text="Back" onPress={() => this.props.dispatch(navigateBack())} />
        </Flex>

        <Text style={{fontSize: 48, fontFamily: 'AmaticSC-Bold'}}>Hi {this.props.firstName}!</Text>
        <Text>While everyone's spiritual journey is unique, many people progress through a five stage journey toward God.</Text>
        <Text>Let's figure out where you are on your journey.</Text>

        <Flex style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
          <Button
            onPress={() => this.props.dispatch(navigatePush('Stage'))}
            text="LET'S GET STARTED"
            style={{alignItems: 'center'}}
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
