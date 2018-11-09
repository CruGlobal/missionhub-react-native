import React, { Component } from 'react';
import { View, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { Button, Text, Flex, Input } from '../../components/common';
import { createMyPerson } from '../../actions/onboardingProfile';
import { disableBack } from '../../utils/common';
import { getMe } from '../../actions/person';

import styles from './styles';

@translate('setup')
class SetupScreen extends Component {
  state = { firstName: '', lastName: '' };

  componentDidMount() {
    disableBack.add();
  }

  componentWillUnmount() {
    disableBack.remove();
  }

  saveAndGoToGetStarted = async () => {
    const { dispatch, next } = this.props;
    const { firstName, lastName } = this.state;

    if (firstName) {
      Keyboard.dismiss();

      await dispatch(createMyPerson(firstName, lastName));
      const { id: personId } = await dispatch(getMe());
      disableBack.remove();
      dispatch(next({ personId }));
    }
  };

  updateFirstName = t => this.setState({ firstName: t });

  updateLastName = t => this.setState({ lastName: t });

  lastNameRef = c => (this.lastName = c);

  onSubmitEditing = () => this.lastName.focus();

  render() {
    const { t } = this.props;
    const { firstName, lastName } = this.state;

    return (
      <View style={styles.container}>
        <Flex value={1} />
        <Flex value={2} style={{ alignItems: 'center' }}>
          <Text type="header" style={styles.header}>
            {t('firstThing')}
          </Text>
          <Text type="header" style={styles.headerTwo}>
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

          <View style={{ paddingTop: 30 }}>
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
        </Flex>

        <Flex value={1} align="stretch" justify="end">
          <Button
            type="secondary"
            onPress={this.saveAndGoToGetStarted}
            text={t('next').toUpperCase()}
          />
        </Flex>
      </View>
    );
  }
}

SetupScreen.propTypes = {
  next: PropTypes.func.isRequired,
};

export default connect()(SetupScreen);
export const SETUP_SCREEN = 'nav/SETUP';
