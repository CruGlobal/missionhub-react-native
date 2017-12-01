import React, { Component } from 'react';
import { connect } from 'react-redux';

import IconMessageScreen from '../IconMessageScreen/index';
import theme from '../../theme';

class AddSomeoneScreen extends Component {
  render() {
    const message = 'Growing closer to God involves helping others experience Him. Who do you want to take steps of faith with?';
    let nextScreen = 'SetupPerson';
    // Android doesn't need a primer for notifications the way iOS does
    if (!theme.isAndroid && !this.props.hasAskedPushNotifications) {
      nextScreen = 'NotificationPrimer';
    }
    return (
      <IconMessageScreen
        mainText={message}
        buttonText="ADD SOMEONE"
        nextScreen={nextScreen}
        iconPath={require('../../../assets/images/add_someone.png')}
      />
    );
  }
}

const mapStateToProps = ({ notifications }) => ({
  hasAskedPushNotifications: notifications.hasAsked,
});
export default connect(mapStateToProps)(AddSomeoneScreen);
