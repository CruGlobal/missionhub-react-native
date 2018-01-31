import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import PathwayStageScreen from './PathwayStageScreen';
import { selectPersonStage, updateUserStage } from '../actions/selectStage';
import { navigatePush, navigateBack } from '../actions/navigation';
import { isAndroid } from '../utils/common';
import { NOTIFICATION_PRIMER_SCREEN } from './NotificationPrimerScreen';
import { PERSON_SELECT_STEP_SCREEN } from './PersonSelectStepScreen';
import { MAIN_TABS } from '../constants';

class PersonStageScreen extends Component {
  constructor(props) {
    super(props);

    this.handleSelectStage = this.handleSelectStage.bind(this);
  }

  handleNavigate = () => {
    let nextScreen = MAIN_TABS;
    // Android doesn't need a primer for notifications the way iOS does
    if (!isAndroid && !this.props.hasAskedPushNotifications) {
      nextScreen = NOTIFICATION_PRIMER_SCREEN;
    }
    this.props.dispatch(navigatePush(nextScreen));
  }

  handleSelectStage(stage) {
    if (this.props.onComplete) {
      this.props.dispatch(updateUserStage(this.props.contactAssignmentId, stage.id)).then(()=>{
        this.props.onComplete(stage);
        this.props.dispatch(navigateBack());
      });
    } else {
      this.props.dispatch(selectPersonStage(this.props.contactId || this.props.personId, this.props.myId, stage.id)).then(() => {
        this.props.dispatch(navigatePush(PERSON_SELECT_STEP_SCREEN, { onSaveNewSteps: this.handleNavigate }));
      });
    }
  }

  render() {
    const questionText = `Which stage best describes where ${this.props.name || this.props.personFirstName} is on their journey?`;

    return (
      <PathwayStageScreen
        buttonText="HERE"
        questionText={questionText}
        onSelect={this.handleSelectStage} />
    );
  }

}


PersonStageScreen.propTypes = {
  onComplete: PropTypes.func,
  name: PropTypes.string,
  contactId: PropTypes.string,
  currentStage: PropTypes.string,
  contactAssignmentId: PropTypes.string,
};

const mapStateToProps = ({ personProfile, auth }, { navigation }) => ({
  ...(navigation.state.params || {}),
  personFirstName: personProfile.personFirstName,
  personId: personProfile.id,
  myId: auth.personId,
});

export default connect(mapStateToProps)(PersonStageScreen);
