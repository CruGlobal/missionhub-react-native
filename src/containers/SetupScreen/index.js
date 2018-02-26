import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Keyboard } from 'react-native';
import { translate } from 'react-i18next';

import styles from './styles';
import { Button, Text, PlatformKeyboardAvoidingView, Flex, Input } from '../../components/common';
import { navigatePush } from '../../actions/navigation';
import { createMyPerson, firstNameChanged, lastNameChanged } from '../../actions/onboardingProfile';
import { GET_STARTED_SCREEN } from '../GetStartedScreen';
import { disableBack } from '../../utils/common';

@translate('setup')
class SetupScreen extends Component {
  componentDidMount() {
    disableBack.add();
  }

  componentWillUnmount() {
    disableBack.remove();
  }

  saveAndGoToGetStarted() {
    if (this.props.firstName) {
      Keyboard.dismiss();

      this.props.dispatch(createMyPerson(this.props.firstName, this.props.lastName)).then(() => {
        disableBack.remove();
        this.props.dispatch(navigatePush(GET_STARTED_SCREEN));
      });
    }
  }

  render() {
    const { t } = this.props;

    return (
      <PlatformKeyboardAvoidingView>
        <Flex value={1} />
        <Flex value={2} style={{ alignItems: 'center' }}>
          <Text type="header" style={styles.header}>{t('firstThing')}</Text>
          <Text type="header" style={styles.headerTwo}>{t('namePrompt')}</Text>
        </Flex>

        <Flex value={3} style={{ padding: 30 }}>
          <View>
            <Text style={styles.label}>{t('profileLabels.firstNameRequired')}</Text>
            <Input
              ref={(c) => this.firstName = c}
              onChangeText={(t) => this.props.dispatch(firstNameChanged(t))}
              value={this.props.firstName}
              autoFocus={true}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => this.lastName.focus()}
              placeholder={t('profileLabels.firstName')}
              placeholderTextColor="white"
            />
          </View>

          <View style={{ paddingTop: 30 }}>
            <Input
              ref={(c) => this.lastName = c}
              onChangeText={(t) => this.props.dispatch(lastNameChanged(t))}
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
            onPress={() => this.saveAndGoToGetStarted()}
            text={t('next').toUpperCase()}
          />
        </Flex>
      </PlatformKeyboardAvoidingView>
    );
  }
}

const mapStateToProps = ({ profile }) => ({
  firstName: profile.firstName,
  lastName: profile.lastName,
});

export default connect(mapStateToProps)(SetupScreen);
export const SETUP_SCREEN = 'nav/SETUP';
