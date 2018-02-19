import React, { Component } from 'react';
import { Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { navigatePush } from '../actions/navigation';

import IconMessageScreen from './IconMessageScreen';
import { SETUP_PERSON_SCREEN } from './SetupPersonScreen';

@translate('addContact')
class AddSomeoneScreen extends Component {
  handleNavigate = () => {
    this.props.dispatch(navigatePush(SETUP_PERSON_SCREEN));
    Keyboard.dismiss();
  }

  render() {
    const { t } = this.props;

    return (
      <IconMessageScreen
        mainText={t('message')}
        onComplete={this.handleNavigate}
        buttonText={t('addSomeone').toUpperCase()}
        iconPath={require('../../assets/images/add_someone.png')}
      />
    );
  }
}

export default connect()(AddSomeoneScreen);
export const ADD_SOMEONE_SCREEN = 'nav/ADD_SOMEONE';
