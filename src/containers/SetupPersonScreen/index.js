import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Keyboard, Image } from 'react-native';
import { translate } from 'react-i18next';
import styles from './styles';
import setupStyles from '../SetupScreen/styles';
import { Button, Text, PlatformKeyboardAvoidingView, Flex } from '../../components/common';
import Input from '../../components/Input/index';
import BackButton from '../BackButton';
import { navigatePush, navigateReset } from '../../actions/navigation';
import { personFirstNameChanged, personLastNameChanged } from '../../actions/person';
import { createPerson, editPersonName } from '../../actions/profile';

@translate('setupPerson')
class SetupPersonScreen extends Component {
  constructor(props) {
    super(props);
    if (this.props.isEdit) {
      this.props.dispatch(personFirstNameChanged(this.props.person.first_name));
      this.props.dispatch(personLastNameChanged(this.props.person.last_name));
    } else {
      this.props.dispatch(personFirstNameChanged(''));
      this.props.dispatch(personLastNameChanged(''));
    }
  }

  saveAndGoToGetStarted() {
    if (this.props.personFirstName) {
      Keyboard.dismiss();

      this.props.dispatch(createPerson(this.props.personFirstName, this.props.personLastName)).then(() => {
        this.props.dispatch(navigatePush('PersonStage'));
      });
    }
  }

  saveEdits() {
    if (this.props.personFirstName) {
      Keyboard.dismiss();

      this.props.dispatch(editPersonName(this.props.person.id, this.props.personFirstName, this.props.personLastName)).then(() => {
        this.props.dispatch(navigateReset('Contact', { person: { ...this.props.person, first_name: this.props.personFirstName, last_name: this.props.personLastName } }));
      });
    }
  }

  render() {
    const { t, isEdit } = this.props;

    return (
      <PlatformKeyboardAvoidingView>
        <BackButton />
        <Flex value={1} />
        <Flex value={2} style={{ alignItems: 'center' }}>
          { isEdit ?
            <Text type="header" style={styles.headerText}>{t('editTitle')}</Text> :
            <Image source={require('../../../assets/images/add_someone.png')} />
          }
        </Flex>

        <Flex value={3} style={{ padding: 30 }}>
          <View>
            <Text style={setupStyles.label}>{t('profileLabels.firstNameNickname')}</Text>
            <Input
              ref={(c) => this.personFirstName = c}
              onChangeText={(t) => this.props.dispatch(personFirstNameChanged(t))}
              value={this.props.personFirstName}
              autoFocus={true}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => this.personLastName.focus()}
              placeholder={t('profileLabels.firstName')}
              placeholderTextColor="white"
            />
          </View>

          <View style={{ paddingTop: 30 }}>
            <Input
              ref={(c) => this.personLastName = c}
              onChangeText={(t) => this.props.dispatch(personLastNameChanged(t))}
              value={this.props.personLastName}
              returnKeyType="next"
              placeholder={t('profileLabels.lastNameOptional')}
              placeholderTextColor="white"
              blurOnSubmit={true}
            />
          </View>
        </Flex>

        <Flex value={1} align="stretch" justify="end">
          <Button
            type="secondary"
            onPress={() => isEdit ? this.saveEdits() : this.saveAndGoToGetStarted()}
            text={ isEdit ? t('save').toUpperCase() : t('next').toUpperCase() }
          />
        </Flex>
      </PlatformKeyboardAvoidingView>
    );
  }
}

const mapStateToProps = ({ personProfile }, { navigation }) => ({
  ...(navigation.state.params || {}),
  isEdit: !!navigation.state.params.person,
  personFirstName: personProfile.personFirstName,
  personLastName: personProfile.personLastName,
});

export default connect(mapStateToProps)(SetupPersonScreen);
