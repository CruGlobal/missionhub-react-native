import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import { logout } from '../../actions/auth';
import { navigatePush } from '../../actions/navigation';

import styles from './styles';
import { Flex, Text, Button } from '../../components/common';
import Header, { HeaderIcon } from '../Header';

class InteractionsScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          left={<HeaderIcon
            onPress={() => this.props.dispatch(logout())}
            icon="home"
          />}
          right={<HeaderIcon
            onPress={() => this.props.dispatch(logout())}
            icon="more-vert"
          />}
          title="Someone's name"
          title2="Cru at Disney College Program - Some more really long text"
        />
        <Flex align="center" justify="center" value={1} style={styles.container}>
          <Text i18n="Interactions_Title" />
          <Button
            onPress={() => this.props.dispatch(logout())}
            text="Logout"
          />
          <Button
            onPress={() => this.props.dispatch(navigatePush('ProfileTab'))}
            text="Go To Profile"
          />
        </Flex>
      </View>
    );
  }
}

export default connect()(InteractionsScreen);
