import React, {Component} from 'react';
import {connect} from 'react-redux';
import {navigatePush, navigateBack} from '../../actions/navigation';

import styles from './styles';
import {Flex, Text, Button} from '../../components/common';

class StageSuccessScreen extends Component {
  render() {
    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <Flex style={{position: 'absolute', top: 0, left: 0}}>
          <Button text="Back" onPress={() => this.props.dispatch(navigateBack())} />
        </Flex>

        <Text style={{fontSize: 48, fontWeight: 'bold'}}>WOW!</Text>
        <Text>We'd like to offer some things to help you in your spiritual journey.</Text>
        <Button
          onPress={() => console.log('go to next screen')}
          text="OK"
        />
      </Flex>
    );
  }
}

export default connect()(StageSuccessScreen);
