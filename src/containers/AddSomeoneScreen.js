import React, { Component } from 'react';
import { connect } from 'react-redux';

import IconMessageScreen from './IconMessageScreen';

class AddSomeoneScreen extends Component {
  render() {
    const message = 'Growing closer to God involves helping others experience Him. Who do you want to take steps of faith with?';

    return (
      <IconMessageScreen
        mainText={message}
        buttonText="ADD SOMEONE"
        nextScreen="SetupPerson"
        iconPath={require('../../assets/images/add_someone.png')}
      />
    );
  }
}

export default connect()(AddSomeoneScreen);
