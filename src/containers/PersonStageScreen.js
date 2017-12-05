import React, {Component} from 'react';
import {connect} from 'react-redux';

import PathwayStageScreen from './PathwayStageScreen';
import {selectPersonStage} from '../actions/selectStage';
import theme from '../theme';

class PersonStageScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const questionText = 'Which stage best describes where ' + this.props.personFirstName + ' is on their journey?';
    let nextScreen = 'MainTabs';

    // Android doesn't need a primer for notifications the way iOS does
    if (!theme.isAndroid && !this.props.hasAskedPushNotifications) {
      nextScreen = 'NotificationPrimer';
    }

    return (
      <PathwayStageScreen
        buttonText="HERE"
        questionText={questionText}
        nextScreen={nextScreen}
        onSelect={selectPersonStage.bind(null, this.props.personId, this.props.id)} />
    );
  }

}

const mapStateToProps = ({personProfile, auth, notifications}) => ({
  personFirstName: personProfile.personFirstName,
  personId: personProfile.id,
  id: auth.personId,
  hasAskedPushNotifications: notifications.hasAsked,
});

export default connect(mapStateToProps)(PersonStageScreen);
