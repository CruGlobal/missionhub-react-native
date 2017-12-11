import React, {Component} from 'react';
import {connect} from 'react-redux';

import SelectStepScreen from './SelectStepScreen';
import theme from '../theme';

class PersonSelectStepScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const text = 'How do you want to help ' + this.props.personFirstName + ' experience God?';
    let nextScreen = 'MainTabs';

    // Android doesn't need a primer for notifications the way iOS does
    if (!theme.isAndroid && !this.props.hasAskedPushNotifications) {
      nextScreen = 'NotificationPrimer';
    }

    return (
      <SelectStepScreen nextScreen={nextScreen} headerText={text} />
    );
  }

}

const mapStateToProps = ({personProfile, notifications}) => ({
  personFirstName: personProfile.personFirstName,
  hasAskedPushNotifications: notifications.hasAsked,
});

export default connect(mapStateToProps)(PersonSelectStepScreen);