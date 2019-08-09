import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, View, Keyboard } from 'react-native';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { Text, Flex, Input } from '../../components/common';
import BottomButton from '../../components/BottomButton';
import {
  createMyPerson,
  firstNameChanged,
  lastNameChanged,
} from '../../actions/onboardingProfile';
import { updatePerson } from '../../actions/person';
import { disableBack } from '../../utils/common';
import TosPrivacy from '../../components/TosPrivacy';

import styles from './styles';

@withTranslation('setup')
class SetupScreen extends Component {
  state = {
    id: null,
  };

  componentDidMount() {
    disableBack.add();
  }

  componentWillUnmount() {
    disableBack.remove();
  }

  updateMyPerson = async () => {
    const { dispatch, firstName, lastName } = this.props;
    const { id } = this.state;

    const { response } = await dispatch(
      updatePerson({ id, firstName, lastName }),
    );
    this.setState({ id: response.id });
  };

  createMyPerson = async () => {
    const { dispatch, firstName, lastName } = this.props;

    const { person_id } = await dispatch(createMyPerson(firstName, lastName));
    this.setState({ id: person_id });
  };

  saveAndGoToGetStarted = async () => {
    const { dispatch, next, firstName } = this.props;
    const { id } = this.state;

    if (firstName) {
      Keyboard.dismiss();

      await (id ? this.updateMyPerson() : this.createMyPerson());

      disableBack.remove();
      dispatch(next({}));
    }
  };

  updateFirstName = t => this.props.dispatch(firstNameChanged(t));

  updateLastName = t => this.props.dispatch(lastNameChanged(t));

  firstNameRef = c => (this.firstName = c);

  lastNameRef = c => (this.lastName = c);

  onSubmitEditing = () => this.lastName.focus();

  render() {
    const { t, firstName, lastName } = this.props;

    return (
      <SafeAreaView style={styles.container}>
        <Flex value={2} justify="end" align="center">
          <Text header={true} style={styles.header}>
            {t('namePrompt')}
          </Text>
        </Flex>

        <Flex value={3} style={{ padding: 30 }}>
          <View>
            <Text style={styles.label}>
              {t('profileLabels.firstNameRequired')}
            </Text>
            <Input
              ref={this.firstNameRef}
              onChangeText={this.updateFirstName}
              value={firstName}
              autoFocus={true}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={this.onSubmitEditing}
              placeholder={t('profileLabels.firstName')}
              placeholderTextColor="white"
            />
          </View>

          <View style={{ paddingVertical: 30 }}>
            <Input
              ref={this.lastNameRef}
              onChangeText={this.updateLastName}
              value={lastName}
              returnKeyType="next"
              placeholder={t('profileLabels.lastName')}
              placeholderTextColor="white"
              blurOnSubmit={true}
            />
          </View>
          <TosPrivacy trial={true} />
        </Flex>
        <BottomButton onPress={this.saveAndGoToGetStarted} text={t('next')} />
      </SafeAreaView>
    );
  }
}

SetupScreen.propTypes = {
  next: PropTypes.func.isRequired,
};

const mapStateToProps = ({ profile }, { next }) => ({
  next,
  firstName: profile.firstName,
  lastName: profile.lastName,
});

export default connect(mapStateToProps)(SetupScreen);
export const SETUP_SCREEN = 'nav/SETUP';
