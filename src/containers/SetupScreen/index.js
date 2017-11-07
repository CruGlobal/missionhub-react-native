import React, {Component} from 'react';
import {connect} from 'react-redux';
import {KeyboardAvoidingView} from 'react-native';
import styles from './styles';
import {Button, Flex, Text} from '../../components/common';
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
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <Text>-FIRST THINGS FIRST-</Text>
        <Text style={{fontSize: 36, fontFamily: 'AmaticSC-Bold'}}>What's your name?</Text>

        <KeyboardAvoidingView style={styles.fieldsWrap} behavior="position">
          <Flex direction="column">
            <Text i18n="Profile_Label_FirstName" style={styles.label}/>
            {this.state.error ? <Text style={{color: 'red'}}>This field is required.</Text> : null}
            <Input
              ref={(c) => this.firstName = c}
              onChangeText={(t) => this.props.dispatch(firstNameChanged(t))}
              value={this.props.firstName}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => this.lastName.focus()}
            />
          </Flex>
          <Flex direction="column">
            <Text i18n="Profile_Label_LastName" style={styles.label}/>
            <Input
              ref={(c) => this.lastName = c}
              onChangeText={(t) => this.props.dispatch(lastNameChanged(t))}
              value={this.props.lastName}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => this.firstName.focus()}
            />
          </Flex>
        </KeyboardAvoidingView>

        <Flex style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
          <Button
            onPress={() => this.saveAndGoToGetStarted()}
            text="NEXT"
            style={{alignItems: 'center'}}
            buttonTextStyle={projectStyles.primaryButtonTextStyle}
          />
        </Flex>
      </Flex>
    );
  }
}

const mapStateToProps = ({profile}) => ({
  firstName: profile.firstName,
  lastName: profile.lastName,
});

export default connect(mapStateToProps)(SetupScreen);
