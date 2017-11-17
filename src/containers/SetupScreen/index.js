import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, Keyboard} from 'react-native';
import styles from './styles';
import {Button, Text, PlatformKeyboardAvoidingView} from '../../components/common';
import Input from '../../components/Input/index';
import {navigatePush} from '../../actions/navigation';
import {firstNameChanged, lastNameChanged} from '../../actions/profile';
import projectStyles from '../../projectStyles';

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
        <View />
        <View style={{alignItems: 'center'}}>
          <Text style={{fontFamily: 'AmaticSC-Bold', fontSize: 24}}>-first things first-</Text>
          <Text style={[projectStyles.primaryHeaderStyle, {fontSize: 36}]}>what's your name?</Text>
        </View>

        <View style={{paddingTop: 30, paddingLeft: 30, paddingRight: 30}}>
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
        </View>

        <View style={{alignItems: 'stretch'}}>
          <Button
            type="header"
            onPress={() => this.saveAndGoToGetStarted()}
            text="NEXT"
            style={projectStyles.primaryButtonStyle}
            buttonTextStyle={projectStyles.primaryButtonTextStyle}
          />
        </View>
      </PlatformKeyboardAvoidingView>
    );
  }
}

const mapStateToProps = ({profile}) => ({
  firstName: profile.firstName,
  lastName: profile.lastName,
});

export default connect(mapStateToProps)(SetupScreen);
