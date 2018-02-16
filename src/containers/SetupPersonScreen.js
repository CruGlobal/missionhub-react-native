import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Keyboard, Image } from 'react-native';
import { translate } from 'react-i18next';
import styles from './SetupScreen/styles';
import { Button, Text, PlatformKeyboardAvoidingView, Flex } from '../components/common';
import Input from '../components/Input/index';
import { navigatePush } from '../actions/navigation';
import { personFirstNameChanged, personLastNameChanged, resetPerson } from '../actions/person';
import { createPerson, updateOnboardingPerson } from '../actions/profile';
import { PERSON_STAGE_SCREEN } from './PersonStageScreen';

@translate()
class SetupPersonScreen extends Component {

  state = { personId: null };

  componentWillUnmount() {
    // make sure to remove the person after this page gets unmounted
    this.props.dispatch(resetPerson());
  }
  
  navigate = () => {
    this.props.dispatch(navigatePush(PERSON_STAGE_SCREEN, {
      section: 'onboarding',
      subsection: 'add person',
    }));
  }

  saveAndGoToGetStarted = () => {
    const { dispatch, personFirstName, personLastName } = this.props;
    if (personFirstName) {
      Keyboard.dismiss();

      if (this.state.personId) {
        const data = {
          id: this.state.personId,
          firstName: personFirstName,
          lastName: personLastName,
        };
        dispatch(updateOnboardingPerson(data)).then(this.navigate);
      } else {
        dispatch(createPerson(personFirstName, personLastName)).then((r) => {
          const person = r.findAll('person')[0];
          if (person && person.id) {
            this.setState({ personId: person.id });
          }
          this.navigate();
        });
      }
    }
  }

  render() {
    const { t, personFirstName, personLastName, dispatch } = this.props;

    return (
      <PlatformKeyboardAvoidingView>
        <Flex value={1} />
        <Flex value={2} align="center">
          <Image source={require('../../assets/images/add_someone.png')} />
        </Flex>

        <Flex value={3} style={{ padding: 30 }}>
          <View>
            <Text style={styles.label}>{t('profileLabels.firstNameNickname')}</Text>
            <Input
              ref={(c) => this.personFirstName = c}
              onChangeText={(t) => dispatch(personFirstNameChanged(t))}
              value={personFirstName}
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
              onChangeText={(t) => dispatch(personLastNameChanged(t))}
              value={personLastName}
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
            onPress={this.saveAndGoToGetStarted}
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
