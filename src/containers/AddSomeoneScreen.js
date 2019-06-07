import React, { Component } from 'react';
import { Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { disableBack } from '../utils/common';
import { skipOnboarding } from '../actions/onboardingProfile';

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
    const { dispatch, next } = this.props;

    disableBack.remove();
    dispatch(next({}));
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

AddSomeoneScreen.propTypes = {
  next: PropTypes.func.isRequired,
};

export default connect()(AddSomeoneScreen);
export const ADD_SOMEONE_SCREEN = 'nav/ADD_SOMEONE';
