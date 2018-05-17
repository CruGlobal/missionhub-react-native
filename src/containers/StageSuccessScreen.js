import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import { navigatePush } from '../actions/navigation';
import { disableBack } from '../utils/common';

import IconMessageScreen from './IconMessageScreen/index';
import { SELECT_MY_STEP_ONBOARDING_SCREEN } from './SelectMyStepScreen';
import { ADD_SOMEONE_SCREEN } from './AddSomeoneScreen';

@translate('stageSuccess')
class StageSuccessScreen extends Component {
  componentDidMount() {
    disableBack.add();
  }

  componentWillUnmount() {
    disableBack.remove();
  }

  handleNavigate = () => {
    this.props.dispatch(navigatePush(ADD_SOMEONE_SCREEN));
  };

  handleNavigateToStep = () => {
    disableBack.remove();
    this.props.dispatch(
      navigatePush(SELECT_MY_STEP_ONBOARDING_SCREEN, {
        onboarding: true,
        contactStage: this.props.selectedStage,
        onSaveNewSteps: this.handleNavigate,
        enableBackButton: false,
      }),
    );
  };

  getMessage() {
    const { t } = this.props;

    let followUpText =
      this.props.selectedStage &&
      this.props.selectedStage.self_followup_description
        ? this.props.selectedStage.self_followup_description
        : t('backupMessage');
    followUpText = followUpText.replace(
      '<<user>>',
      this.props.firstName ? this.props.firstName : t('friend'),
    );
    return followUpText;
  }

  render() {
    const { t } = this.props;
    const message = this.getMessage();
    return (
      <IconMessageScreen
        mainText={message}
        buttonText={t('chooseSteps').toUpperCase()}
        onComplete={this.handleNavigateToStep}
        iconPath={require('../../assets/images/pathFinder.png')}
      />
    );
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
