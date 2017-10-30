import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import { navigateBack } from '../../actions/navigation';

import styles from './styles';
import { Flex, Text, Button } from '../../components/common';
import Header from '../Header';

class ProfileScreen extends Component {
  render() {
    const { id } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Header />
        <Flex align="center" justify="center" value={1} style={styles.container}>
          <Text>Step {id}</Text>
          <Button
            onPress={() => this.props.dispatch(navigateBack())}
            text="Go Back"
          />
        </Flex>
      </View>
    );
  }
}

const mapStateToProps = (undefined, { navigation }) => ({
  id: navigation.state.params ? navigation.state.params.id : '',
});

export default connect(mapStateToProps)(ProfileScreen);
