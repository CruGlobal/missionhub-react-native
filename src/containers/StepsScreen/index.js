import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

// import { logout } from '../../actions/auth';
import { navigatePush } from '../../actions/navigation';

import styles from './styles';
import { Flex, Text, Button, IconButton } from '../../components/common';
import Header from '../Header';

const isCasey = true;

class StepsScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          left={
            <IconButton name="stepsIcon" type="MissionHub" onPress={()=> LOG('pressed')} />
          }
          right={
            isCasey ? null : (
              <IconButton name="stepsIcon" type="MissionHub" onPress={()=> LOG('pressed')} />
            )
          }
          title="STEPS OF FAITH"
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
