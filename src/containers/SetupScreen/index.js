import React, {Component} from 'react';
import {connect} from 'react-redux';
import {KeyboardAvoidingView,  View} from 'react-native';
import styles from './styles';
import {Button, Text} from '../../components/common';
import Input from '../../components/Input/index';
import {navigatePush} from '../../actions/navigation';
import {firstNameChanged, lastNameChanged} from '../../actions/profile';
import projectStyles from '../../projectStyles';

class SetupScreen extends Component {
  state = {
    error: false,
  };

  saveAndGoToGetStarted() {
    if (this.props.firstName) {
      this.props.dispatch(navigatePush('GetStarted'));
    } else {
      this.setState({error: true});
    }
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View />

        <View style={{alignItems: 'center'}}>
          <Text style={{fontFamily: 'AmaticSC-Bold', fontSize: 24}}>-first things first-</Text>
          <Text style={[projectStyles.primaryHeaderStyle, {fontSize: 36}]}>what's your name?</Text>
        </View>

        <View style={{paddingTop: 30, paddingLeft: 30, paddingRight: 30}}>
          <View>
            <Text i18n="Profile_Label_FirstName" style={styles.label}/>
            {this.state.error ? <Text style={{color: 'red', fontWeight: 'bold'}}>This field is required.</Text> : null}
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
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = ({profile}) => ({
  firstName: profile.firstName,
  lastName: profile.lastName,
});

export default connect(mapStateToProps)(SetupScreen);
