import React, { Component } from 'react';
import { KeyboardAvoidingView, Keyboard } from 'react-native';
import { connect } from 'react-redux';

import styles from './styles';
import { Flex, Text, Button, Input } from '../../components/common';
import { translate } from 'react-i18next';

@translate()
class ProfileFields extends Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: null,
    path: null,
  };

  constructor(props) {
    super(props);

    this.handleSave = this.handleSave.bind(this);
  }

  handleSave() {
    Keyboard.dismiss();
    LOG('save');
  }

  render() {
    const { t } = this.props;
    const { firstName, lastName, email, phone } = this.state;
    return (
      <KeyboardAvoidingView style={styles.fieldsWrap} behavior="position">
        <Flex direction="column">
          <Text style={styles.label}>{t('profileLabels.firstNameRequired')}</Text>
          <Input
            ref={(c) => this.firstName = c}
            onChangeText={(t) => this.setState({ firstName: t })}
            value={firstName}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => this.lastName.focus()}
          />
        </Flex>
        <Flex direction="column">
          <Text style={styles.label}>{t('profileLabels.lastName')}</Text>
          <Input
            ref={(c) => this.lastName = c}
            onChangeText={(t) => this.setState({ lastName: t })}
            value={lastName}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => this.email.focus()}
          />
        </Flex>
        <Flex direction="column">
          <Text style={styles.label}>{t('profileLabels.email')}</Text>
          <Input
            ref={(c) => this.email = c}
            onChangeText={(t) => this.setState({ email: t })}
            value={email}
            keyboardType="email-address"
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => this.phone.focus()}
          />
        </Flex>
        <Flex direction="column">
          <Text style={styles.label}>{t('profileLabels.phone')}</Text>
          <Input
            ref={(c) => this.phone = c}
            onChangeText={(t) => this.setState({ phone: t })}
            value={phone}
            keyboardType="phone-pad"
            returnKeyType="done"
            blurOnSubmit={true}
          />
        </Flex>
        <Flex align="center" justify="center" style={{ marginTop: 25 }}>
          <Button
            onPress={this.handleSave}
            text={t('save').toUpperCase()}
          />
        </Flex>
      </KeyboardAvoidingView>
    );
  }
}

export default connect()(ProfileFields);
