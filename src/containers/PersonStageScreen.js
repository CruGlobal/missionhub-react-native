import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import PathwayStageScreen from './PathwayStageScreen';
import { selectPersonStage } from '../actions/selectStage';
import { navigatePush, navigateBack } from '../actions/navigation';

class PersonStageScreen extends Component {
  constructor(props) {
    super(props);

    this.handleSelectStage = this.handleSelectStage.bind(this);
  }

  handleSelectStage(stage) {
    this.props.dispatch(selectPersonStage(this.props.contactId || this.props.personId, this.props.myId, stage.id)).then(() => {
      if (this.props.onComplete) {
        this.props.onComplete(stage);
        this.props.dispatch(navigateBack());
      } else {
        this.props.dispatch(navigatePush('PersonStep'));
      }
    });
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
  currentStage: PropTypes.number,
};

const mapStateToProps = ({ personProfile, auth }, { navigation }) => ({
  ...(navigation.state.params || {}),
  personFirstName: personProfile.personFirstName,
  personId: personProfile.id,
  myId: auth.personId,
});

export default connect(mapStateToProps)(PersonStageScreen);
