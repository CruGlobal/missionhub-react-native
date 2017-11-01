import React, {Component} from 'react';
import {connect} from 'react-redux';
import {KeyboardAvoidingView} from 'react-native';
import styles from './styles';
import {Flex, Text, Button} from '../../components/common';
import Input from '../../components/Input/index';
import { navigatePush } from '../../actions/navigation';
import {setFirstAndLastName} from '../../actions/profile';


class SetupScreen extends Component {
  state = {
    firstName: '',
    lastName: '',
    error: false,
  };

  saveAndGoToGetStarted() {
    if (this.state.firstName) {
      this.props.dispatch(setFirstAndLastName(this.state.firstName, this.state.lastName));
      this.props.dispatch(navigatePush('GetStarted'));
    } else {
      this.setState({error: true});
    }
  }

  render() {
    const { firstName, lastName, error} = this.state;

    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <Text>-FIRST THINGS FIRST-</Text>
        <Text>What's your name?</Text>

        <KeyboardAvoidingView style={styles.fieldsWrap} behavior="position">
          <Flex direction="column">
            <Text i18n="Profile_Label_FirstName" style={styles.label} />
            {error ? <Text style={{color: 'red'}}>This field is required.</Text> : null }
            <Input
              ref={(c) => this.firstName = c}
              onChangeText={(t) => this.setState({firstName: t})}
              value={firstName}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => this.lastName.focus()}
            />
          </Flex>
          <Flex direction="column">
            <Text i18n="Profile_Label_LastName" style={styles.label} />
            <Input
              ref={(c) => this.lastName = c}
              onChangeText={(t) => this.setState({lastName: t})}
              value={lastName}
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

export default connect()(SetupScreen);
