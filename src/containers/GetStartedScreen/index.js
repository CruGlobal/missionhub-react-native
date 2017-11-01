import React, { Component } from 'react';
import { connect } from 'react-redux';
import { navigatePush } from '../../actions/navigation';

import styles from './styles';
import { Flex, Text, Button } from '../../components/common';

class GetStartedScreen extends Component {
  render() {
    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <Text>Hi {this.props.firstName}!</Text>
        <Text>While everyone's spiritual journey is unique, many people progress through a five stage journey toward God.</Text>
        <Text>Let's figure out where you are on your journey.</Text>
        <Button
          onPress={() => this.props.dispatch(navigatePush('Stage'))}
          text="LET'S GET STARTED"
        />
      </Flex>
    );
  }
}

const mapStateToProps = ({profile}, { navigation }) => ({
  id: navigation.state.params ? navigation.state.params.id : '',
  firstName: profile.firstName,
});

export default connect(mapStateToProps)(GetStartedScreen);
