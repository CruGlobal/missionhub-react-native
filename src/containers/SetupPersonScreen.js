import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Keyboard, Image } from 'react-native';
import { translate } from 'react-i18next';
import styles from './SetupScreen/styles';
import { Button, Text, PlatformKeyboardAvoidingView, Flex } from '../components/common';
import Input from '../components/Input/index';
import { navigatePush } from '../actions/navigation';
import { personFirstNameChanged, personLastNameChanged } from '../actions/person';
import { createPerson } from '../actions/profile';
import { PERSON_STAGE_SCREEN } from './PersonStageScreen';

@translate()
class SetupPersonScreen extends Component {
  saveAndGoToGetStarted() {
    if (this.props.personFirstName) {
      Keyboard.dismiss();

      this.props.dispatch(createPerson(this.props.personFirstName, this.props.personLastName)).then(() => {
        this.props.dispatch(navigatePush(PERSON_STAGE_SCREEN, {
          section: 'onboarding',
          subsection: 'add person',
        }));
      });
    }
  }

  render() {
    const { t } = this.props;

    return (
      <PlatformKeyboardAvoidingView>
        <Flex value={1} />
        <Flex value={2} style={{ alignItems: 'center' }}>
          <Image source={require('../../assets/images/add_someone.png')} />
        </Flex>

        <Flex value={3} style={{ padding: 30 }}>
          <View>
            <Text style={styles.label}>{t('profileLabels.firstNameNickname')}</Text>
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
            onPress={() => this.saveAndGoToGetStarted()}
            text={t('next').toUpperCase()}
          />
        </Flex>
      </PlatformKeyboardAvoidingView>
    );
  }
}

const mapStateToProps = ({ personProfile }) => ({
  personFirstName: personProfile.personFirstName,
  personLastName: personProfile.personLastName,
});

export default connect(mapStateToProps)(SetupPersonScreen);
export const SETUP_PERSON_SCREEN = 'nav/SETUP_PERSON';
