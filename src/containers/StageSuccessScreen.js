import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import IconMessageScreen from './IconMessageScreen/index';

class StageSuccessScreen extends Component {
  constructor(props) {
    super(props);
  }

  getMessage() {
    let followUpText = this.props.selectedStage && this.props.selectedStage.self_followup_description ? this.props.selectedStage.self_followup_description : '';
    followUpText = followUpText.replace('<<user>>', this.props.firstName ? this.props.firstName : 'Friend');
    return followUpText;
  }

  render() {
    const message = this.getMessage();
    return <IconMessageScreen mainText={message} buttonText="CHOOSE MY STEPS" nextScreen="Step" iconPath={require('../../assets/images/pathFinder.png')} />;
  }
}

StageSuccessScreen.propTypes = {
  selectedStage: PropTypes.object.isRequired,
};


const mapStateToProps = ({ profile }, { navigation }) => ({
  ...(navigation.state.params || {}),
  firstName: profile.firstName,
});

export default connect(mapStateToProps)(StageSuccessScreen);
