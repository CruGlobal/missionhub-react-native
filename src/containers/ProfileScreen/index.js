import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';

import { logout } from '../../actions/auth';
import { navigatePush, navigateBack } from '../../actions/navigation';

import styles from './styles';
import { Flex, Text, Button } from '../../components/common';
import Header, { HeaderIcon } from '../Header';
import ProfileFields from '../ProfileFields';

class ProfileScreen extends Component {
  render() {
    const { id } = this.props;
    return (
      <View style={styles.containerWrap}>
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
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.container}
        >
          <Text>Profile {id}</Text>
          <ProfileFields />
          <Flex style={{ marginTop: 50 }} />
          <Button
            onPress={() => this.props.dispatch(logout())}
            text="Logout"
          />
          <Button
            onPress={() => this.props.dispatch(navigatePush('InteractionsTab'))}
            text="Go To Main Tab"
          />
          {
            id ? (
              <Button
                onPress={() => this.props.dispatch(navigateBack())}
                text="Go Back 1 page"
              />
            ) : null
          }
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (undefined, { navigation }) => ({
  id: navigation.state.params ? navigation.state.params.id : '',
});

export default connect(mapStateToProps)(ProfileScreen);
