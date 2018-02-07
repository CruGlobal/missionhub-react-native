import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { navigatePush } from '../actions/navigation';

import IconMessageScreen from './IconMessageScreen';

@translate('addContact')
class AddSomeoneScreen extends Component {
  handleNavigate = () => {
    this.props.dispatch(navigatePush('SetupPerson'));
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
