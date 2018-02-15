import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import { navigatePush } from '../actions/navigation';
import IconMessageScreen from './IconMessageScreen/index';
import { SELECT_MY_STEP_ONBOARDING_SCREEN } from './SelectMyStepScreen';
import { ADD_SOMEONE_SCREEN } from './AddSomeoneScreen';

@translate('stageSuccess')
class StageSuccessScreen extends Component {
  constructor(props) {
    super(props);

    this.handleNavigateToStep = this.handleNavigateToStep.bind(this);
  }

  handleNavigate = () => {
    this.props.dispatch(navigatePush(ADD_SOMEONE_SCREEN));
  }

  handleNavigateToStep() {
    this.props.dispatch(navigatePush(SELECT_MY_STEP_ONBOARDING_SCREEN, { onSaveNewSteps: this.handleNavigate, enableBackButton: false }));
  }

  getMessage() {
    const { t } = this.props;

    let followUpText = this.props.selectedStage && this.props.selectedStage.self_followup_description ? this.props.selectedStage.self_followup_description : t('backupMessage');
    followUpText = followUpText.replace('<<user>>', this.props.firstName ? this.props.firstName : t('friend'));
    return followUpText;
  }

  render() {
    const { t } = this.props;
    const message = this.getMessage();
    return <IconMessageScreen mainText={message} buttonText={t('chooseSteps').toUpperCase()} onComplete={this.handleNavigateToStep} iconPath={require('../../assets/images/pathFinder.png')} />;
  }
}

StageSuccessScreen.propTypes = {
  selectedStage: PropTypes.object,
};


const mapStateToProps = ({ profile }, { navigation }) => ({
  ...(navigation.state.params || {}),
  firstName: profile.firstName,
});

export default connect(mapStateToProps)(StageSuccessScreen);
export const STAGE_SUCCESS_SCREEN = 'nav/STAGE_SUCCESS';