import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Keyboard, Image } from 'react-native';
import { translate } from 'react-i18next';

import {
  Button,
  Text,
  PlatformKeyboardAvoidingView,
  Flex,
} from '../components/common';
import Input from '../components/Input/index';
import { navigatePush } from '../actions/navigation';
import {
  personFirstNameChanged,
  personLastNameChanged,
} from '../actions/onboardingProfile';
import {
  createPerson,
  updateOnboardingPerson,
} from '../actions/onboardingProfile';
import { disableBack } from '../utils/common';
import { trackActionWithoutData } from '../actions/analytics';
import { ACTIONS } from '../constants';

import { PERSON_STAGE_SCREEN } from './PersonStageScreen';
import styles from './SetupScreen/styles';

@translate()
class SetupPersonScreen extends Component {
  state = { personId: null };

  componentDidMount() {
    disableBack.add();
  }

  componentWillUnmount() {
    disableBack.remove();
  }

  navigate = () => {
    this.props.dispatch(
      navigatePush(PERSON_STAGE_SCREEN, {
        section: 'onboarding',
        subsection: 'add person',
      }),
    );
  };

  saveAndGoToGetStarted = async () => {
    const { dispatch, personFirstName, personLastName, myId } = this.props;
    if (personFirstName) {
      Keyboard.dismiss();

      if (this.state.personId) {
        const data = {
          id: this.state.personId,
          firstName: personFirstName,
          lastName: personLastName,
        };
        await dispatch(updateOnboardingPerson(data));
        this.navigate();
      } else {
        const { response: person } = await dispatch(
          createPerson(personFirstName, personLastName, myId),
        );
        dispatch(trackActionWithoutData(ACTIONS.PERSON_ADDED));
        this.setState({ personId: person.id });
        this.navigate();
      }
    }
  };

  onSubmitEditing = () => this.personLastName.focus();

  updatePersonFirstName = t => this.props.dispatch(personFirstNameChanged(t));

  updatePersonLastName = t => this.props.dispatch(personLastNameChanged(t));

  firstNameRef = c => (this.personFirstName = c);

  lastNameRef = c => (this.personLastName = c);

  render() {
    const { t, personFirstName, personLastName } = this.props;

    return (
      <PlatformKeyboardAvoidingView>
        <Flex value={1} />
        <Flex value={2} align="center">
          <Image source={require('../../assets/images/add_someone.png')} />
        </Flex>

        <Flex value={3} style={{ padding: 30 }}>
          <View>
            <Text style={styles.label}>
              {t('profileLabels.firstNameNickname')}
            </Text>
            <Input
              ref={this.firstNameRef}
              onChangeText={this.updatePersonFirstName}
              value={personFirstName}
              autoFocus={true}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={this.onSubmitEditing}
              placeholder={t('profileLabels.firstName')}
              placeholderTextColor="white"
            />
          </View>

          <View style={{ paddingTop: 30 }}>
            <Input
              ref={this.lastNameRef}
              onChangeText={this.updatePersonLastName}
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

const mapStateToProps = ({ auth, personProfile }) => ({
  myId: auth.person.id,
  personFirstName: personProfile.personFirstName,
  personLastName: personProfile.personLastName,
});

export default connect(mapStateToProps)(SetupPersonScreen);
export const SETUP_PERSON_SCREEN = 'nav/SETUP_PERSON';
