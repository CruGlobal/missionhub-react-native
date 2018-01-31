import React, { Component } from 'react';
import { connect } from 'react-redux';
import { navigatePush } from '../actions/navigation';

import IconMessageScreen from './IconMessageScreen';
import { SETUP_PERSON_SCREEN } from './SetupPersonScreen';

class AddSomeoneScreen extends Component {
  handleNavigate = () => {
    this.props.dispatch(navigatePush(SETUP_PERSON_SCREEN));
  }

  render() {
    const message = 'Growing closer to God involves helping others experience Him. Who do you want to take steps of faith with?';

    return (
      <IconMessageScreen
        mainText={message}
        onComplete={this.handleNavigate}
        buttonText="ADD SOMEONE"
        iconPath={require('../../assets/images/add_someone.png')}
      />
    );
  }
}

export default connect()(AddSomeoneScreen);
export const ADD_SOMEONE_SCREEN = 'nav/ADD_SOMEONE';
