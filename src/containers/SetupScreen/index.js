import React, {Component} from 'react';
import {connect} from 'react-redux';
import {KeyboardAvoidingView} from 'react-native';
import styles from './styles';
import {Flex, Text, Button} from '../../components/common';
import Input from '../../components/Input/index';
import {navigatePush} from '../../actions/navigation';
import {firstNameChanged, lastNameChanged} from '../../actions/profile';

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
        <Text>What's your name?</Text>

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

        <Button
          onPress={() => this.saveAndGoToGetStarted()}
          text="Next"
        />
      </Flex>
    );
  }
}

const mapStateToProps = ({profile}) => ({
  firstName: profile.firstName,
  lastName: profile.lastName,
});

export default connect(mapStateToProps)(SetupScreen);
