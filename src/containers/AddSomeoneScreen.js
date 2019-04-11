import React, { Component } from 'react';
import { Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { navigatePush } from '../actions/navigation';
import { disableBack } from '../utils/common';
import { skipOnboarding } from '../actions/onboardingProfile';

import { SETUP_PERSON_SCREEN } from './SetupPersonScreen';
import IconMessageScreen from './IconMessageScreen';

@withTranslation('addContact')
class AddSomeoneScreen extends Component {
  componentDidMount() {
    disableBack.add();
  }

  componentWillUnmount() {
    disableBack.remove();
  }

  handleNavigate = () => {
    disableBack.remove();
    this.props.dispatch(navigatePush(SETUP_PERSON_SCREEN));
    Keyboard.dismiss();
  };

  skip = () => this.props.dispatch(skipOnboarding());

  render() {
    const { t } = this.props;

    return (
      <IconMessageScreen
        mainText={t('message')}
        onComplete={this.handleNavigate}
        buttonText={t('addSomeone')}
        iconPath={require('../../assets/images/add_someone.png')}
        onSkip={this.skip}
      />
    );
  }
}

export default connect()(AddSomeoneScreen);
export const ADD_SOMEONE_SCREEN = 'nav/ADD_SOMEONE';
