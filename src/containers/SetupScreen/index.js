import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, Keyboard} from 'react-native';
import styles from './styles';
import { Button, Text, PlatformKeyboardAvoidingView, Flex } from '../../components/common';
import Input from '../../components/Input/index';
import {navigatePush} from '../../actions/navigation';
import {firstNameChanged, lastNameChanged} from '../../actions/profile';

class SetupScreen extends Component {
  saveAndGoToGetStarted() {
    if (this.props.firstName) {
      this.props.dispatch(navigatePush('GetStarted'));
      Keyboard.dismiss();
    }
  }

  render() {
    return (
      <PlatformKeyboardAvoidingView>
        <Flex value={1} />
        <Flex value={2} style={{alignItems: 'center'}}>
          <Text type="header" style={styles.header}>-first things first-</Text>
          <Text type="header" style={styles.headerTwo}>what's your name?</Text>
        </Flex>

        <Flex value={3} style={{padding: 30}}>
          <View>
            <Text i18n="Profile_Label_FirstName" style={styles.label} />
            <Input
              ref={(c) => this.firstName = c}
              onChangeText={(t) => this.props.dispatch(firstNameChanged(t))}
              value={this.props.firstName}
              autoFocus={true}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => this.lastName.focus()}
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor="white"
              underlineColorAndroid="transparent"
            />
          </View>

          <View style={{paddingTop: 30}}>
            <Input
              ref={(c) => this.lastName = c}
              onChangeText={(t) => this.props.dispatch(lastNameChanged(t))}
              value={this.props.lastName}
              returnKeyType="next"
              placeholder="Last Name"
              placeholderTextColor="white"
              blurOnSubmit={true}
              style={styles.input}
              underlineColorAndroid="transparent"
            />
          </View>
        </Flex>

        <Flex value={1} align="stretch" justify="end">
          <Button
            type="secondary"
            onPress={() => this.saveAndGoToGetStarted()}
            text="NEXT"
          />
        </Flex>
      </PlatformKeyboardAvoidingView>
    );
  }
}

const mapStateToProps = ({profile}) => ({
  firstName: profile.firstName,
  lastName: profile.lastName,
});

export default connect(mapStateToProps)(SetupScreen);
