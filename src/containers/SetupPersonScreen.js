import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Keyboard, Image } from 'react-native';
import { translate } from 'react-i18next';
import styles from './SetupScreen/styles';
import { Button, Text, PlatformKeyboardAvoidingView, Flex } from '../components/common';
import Input from '../components/Input/index';
import { navigatePush } from '../actions/navigation';
import { personFirstNameChanged, personLastNameChanged } from '../actions/onboardingProfile';
import { createPerson, updateOnboardingPerson } from '../actions/onboardingProfile';
import { PERSON_STAGE_SCREEN } from './PersonStageScreen';
import { disableBack } from '../utils/common';

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
    this.props.dispatch(navigatePush(PERSON_STAGE_SCREEN, {
      section: 'onboarding',
      subsection: 'add person',
    }));
  };

  saveAndGoToGetStarted = async() => {
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
        const { response: person } = await dispatch(createPerson(personFirstName, personLastName, myId));
        this.setState({ personId: person.id });
        this.navigate();
      }
    }
  };

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

const mapStateToProps = ({ auth, personProfile }) => ({
  myId: auth.person.id,
  personFirstName: personProfile.personFirstName,
  personLastName: personProfile.personLastName,
});

export default connect(mapStateToProps)(SetupPersonScreen);
export const SETUP_PERSON_SCREEN = 'nav/SETUP_PERSON';
