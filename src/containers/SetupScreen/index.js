import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Keyboard } from 'react-native';
import { translate } from 'react-i18next';

import { Button, Text, Flex, Input } from '../../components/common';
import {
  createMyPerson,
  firstNameChanged,
  lastNameChanged,
} from '../../actions/onboardingProfile';
import { disableBack } from '../../utils/common';
import { getMe } from '../../actions/person';

import styles from './styles';
import { getMyOrganizations } from '../../actions/organizations';

@translate('setup')
class SetupScreen extends Component {
  componentDidMount() {
    disableBack.add();
  }

  componentWillUnmount() {
    disableBack.remove();
  }

  saveAndGoToGetStarted = async () => {
    const { dispatch, next, firstName, lastName } = this.props;

    if (firstName) {
      Keyboard.dismiss();

      await dispatch(createMyPerson(firstName, lastName));
      const { id: personId } = await dispatch(getMe('', true));
      await dispatch(getMyOrganizations());
      disableBack.remove();
      dispatch(next({ personId }));
    }
  };

  updateFirstName = t => this.props.dispatch(firstNameChanged(t));

  updateLastName = t => this.props.dispatch(lastNameChanged(t));

  firstNameRef = c => (this.firstName = c);

  lastNameRef = c => (this.lastName = c);

  onSubmitEditing = () => this.lastName.focus();

  render() {
    const { t } = this.props;

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
              value={this.props.firstName}
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
              value={this.props.lastName}
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

const mapStateToProps = ({ profile }) => ({
  firstName: profile.firstName,
  lastName: profile.lastName,
});

export default connect(mapStateToProps)(SetupScreen);
export const SETUP_SCREEN = 'nav/SETUP';
