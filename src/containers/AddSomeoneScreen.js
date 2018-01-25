import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import IconMessageScreen from './IconMessageScreen';

@translate('addContact')
class AddSomeoneScreen extends Component {
  render() {
    const { t } = this.props;
    
    return (
      <IconMessageScreen
        mainText={t('message')}
        buttonText={t('addSomeone').toUpperCase()}
        nextScreen="SetupPerson"
        iconPath={require('../../assets/images/add_someone.png')}
      />
    );
  }
}

export default connect()(AddSomeoneScreen);
