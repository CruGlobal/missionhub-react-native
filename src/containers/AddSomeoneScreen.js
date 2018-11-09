import React, { Component } from 'react';
import { Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { disableBack } from '../utils/common';

import IconMessageScreen from './IconMessageScreen';

@translate('addContact')
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
    dispatch(next());
    Keyboard.dismiss();
  };

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
