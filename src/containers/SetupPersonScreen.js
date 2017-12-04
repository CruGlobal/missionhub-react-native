import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Keyboard, Image } from 'react-native';
import styles from './SetupScreen/styles';
import { Button, Text, PlatformKeyboardAvoidingView, Flex } from '../components/common';
import Input from '../components/Input/index';
import { navigatePush } from '../actions/navigation';
import {personFirstNameChanged, personLastNameChanged} from '../actions/person';
import {createPerson} from '../actions/profile';
import theme from '../theme';

class SetupPersonScreen extends Component {
  saveAndGoToGetStarted(nextScreen) {
    if (this.props.personFirstName) {
      Keyboard.dismiss();

      this.props.dispatch(createPerson(this.props.personFirstName, this.props.personLastName)).then(() => {
        this.props.dispatch(navigatePush(nextScreen));
      });
    }
  }

  render() {
    let nextScreen = 'MainTabs';

    // Android doesn't need a primer for notifications the way iOS does
    if (!theme.isAndroid && !this.props.hasAskedPushNotifications) {
      nextScreen = 'NotificationPrimer';
    }

    return (
      <PlatformKeyboardAvoidingView>
        <Flex value={1} />
        <Flex value={2} style={{alignItems: 'center'}}>
          <Image source={require('../../assets/images/add_someone.png')} />
        </Flex>

        <Flex value={3} style={{padding: 30}}>
          <View>
            <Text i18n="Profile_Label_FirstName" style={styles.label} />
            <Input
              ref={(c) => this.personFirstName = c}
              onChangeText={(t) => this.props.dispatch(personFirstNameChanged(t))}
              value={this.props.personFirstName}
              autoFocus={true}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => this.personLastName.focus()}
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor="white"
            />
          </View>

          <View style={{paddingTop: 30}}>
            <Input
              ref={(c) => this.personLastName = c}
              onChangeText={(t) => this.props.dispatch(personLastNameChanged(t))}
              value={this.props.personLastName}
              returnKeyType="next"
              placeholder="Last Name (if you want)"
              placeholderTextColor="white"
              blurOnSubmit={true}
              style={styles.input}
            />
          </View>
        </Flex>

        <Flex value={1} align="stretch" justify="end">
          <Button
            type="secondary"
            onPress={() => this.saveAndGoToGetStarted(nextScreen)}
            text="NEXT"
          />
        </Flex>
      </PlatformKeyboardAvoidingView>
    );
  }
}

const mapStateToProps = ({personProfile, notifications}) => ({
  personFirstName: personProfile.personFirstName,
  personLastName: personProfile.personLastName,
  hasAskedPushNotifications: notifications.hasAsked,
});

export default connect(mapStateToProps)(SetupPersonScreen);
