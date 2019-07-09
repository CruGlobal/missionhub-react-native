import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, View, Keyboard, Image } from 'react-native';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { Text, Flex } from '../components/common';
import BottomButton from '../components/BottomButton';
import Input from '../components/Input/index';
import { navigatePush } from '../actions/navigation';
import {
  personFirstNameChanged,
  personLastNameChanged,
  createPerson,
  updateOnboardingPerson,
  skipOnboarding,
} from '../actions/onboardingProfile';
import { disableBack } from '../utils/common';
import { trackActionWithoutData } from '../actions/analytics';
import { ACTIONS } from '../constants';
import AbsoluteSkip from '../components/AbsoluteSkip';

import { PERSON_STAGE_SCREEN } from './PersonStageScreen';
import styles from './SetupScreen/styles';

@withTranslation()
class SetupPersonScreen extends Component {
  state = { personId: null };

  componentDidMount() {
    disableBack.add();
  }

  componentWillUnmount() {
    disableBack.remove();
  }

  navigate = (skip = false) => {
    const { dispatch, next } = this.props;

    if (next) {
      return dispatch(next({ skip }));
    }

    dispatch(
      skip
        ? skipOnboarding()
        : navigatePush(PERSON_STAGE_SCREEN, {
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
      } else {
        const { response: person } = await dispatch(
          createPerson(personFirstName, personLastName, myId),
        );
        dispatch(trackActionWithoutData(ACTIONS.PERSON_ADDED));
        this.setState({ personId: person.id });
      }

      this.navigate();
    }
  };

  onSubmitEditing = () => this.personLastName.focus();

  updatePersonFirstName = t => this.props.dispatch(personFirstNameChanged(t));

  updatePersonLastName = t => this.props.dispatch(personLastNameChanged(t));

  firstNameRef = c => (this.personFirstName = c);

  lastNameRef = c => (this.personLastName = c);

  skip = () => this.navigate(true);

  render() {
    const { t, personFirstName, personLastName } = this.props;

    return (
      <SafeAreaView style={styles.container}>
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
        <BottomButton onPress={this.saveAndGoToGetStarted} text={t('next')} />
        <AbsoluteSkip onSkip={this.skip} />
      </SafeAreaView>
    );
  }
}

SetupPersonScreen.propTypes = {
  next: PropTypes.func,
};

const mapStateToProps = ({ auth, personProfile }, { next }) => ({
  next,
  myId: auth.person.id,
  personFirstName: personProfile.personFirstName,
  personLastName: personProfile.personLastName,
});

export default connect(mapStateToProps)(SetupPersonScreen);
export const SETUP_PERSON_SCREEN = 'nav/SETUP_PERSON';
