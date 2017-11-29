import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

// import { logout } from '../../actions/auth';
import { navigatePush } from '../../actions/navigation';

import styles from './styles';
import { Flex, Text, Button, IconButton } from '../../components/common';
import Header from '../Header';

class StepsScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          left={
            <IconButton name="stepsIcon" type="MissionHub" onPress={()=> LOG('pressed')} />
          }
          right={
            <IconButton name="stepsIcon" type="MissionHub" onPress={()=> LOG('pressed')} />
          }
          title="Steps"
        />
        <Flex align="center" justify="center" value={1} style={styles.container}>
          <Text>Steps</Text>
          <Button
            onPress={() => this.props.dispatch(navigatePush('Step', { id: '1' }))}
            text="Go To Step 1"
          />
        </Flex>
      </View>
    );
  }
}

export default connect()(StepsScreen);
