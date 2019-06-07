import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { navigatePush } from '../actions/navigation';
import { disableBack } from '../utils/common';

import IconMessageScreen from './IconMessageScreen/index';
import { SELECT_MY_STEP_ONBOARDING_SCREEN } from './SelectMyStepScreen';
import { ADD_SOMEONE_SCREEN } from './AddSomeoneScreen';

@withTranslation('stageSuccess')
class StageSuccessScreen extends Component {
  componentDidMount() {
    disableBack.add();
  }

  componentWillUnmount() {
    disableBack.remove();
  }

  handleNavigate = () => dispatch => dispatch(navigatePush(ADD_SOMEONE_SCREEN));

  handleNavigateToStep = () => {
    const { dispatch, stage } = this.props;

    disableBack.remove();
    dispatch(
      navigatePush(SELECT_MY_STEP_ONBOARDING_SCREEN, {
        onboarding: true,
        contactStage: stage,
        enableBackButton: false,
        next: this.handleNavigate,
      }),
    );
  };

  getMessage() {
    const { t, stage, firstName } = this.props;

    let followUpText =
      stage && stage.self_followup_description
        ? stage.self_followup_description
        : t('backupMessage');
    followUpText = followUpText.replace(
      '<<user>>',
      firstName ? firstName : t('friend'),
    );
    return followUpText;
  }

  render() {
    const { t } = this.props;
    const message = this.getMessage();
    return (
      <IconMessageScreen
        mainText={message}
        buttonText={t('chooseSteps')}
        onComplete={this.handleNavigateToStep}
        iconPath={require('../../assets/images/pathFinder.png')}
      />
    );
  }
}

StageSuccessScreen.propTypes = {
  stage: PropTypes.object,
};

const mapStateToProps = ({ profile }, { navigation }) => ({
  ...(navigation.state.params || {}),
  firstName: profile.firstName,
});

export default connect(mapStateToProps)(StageSuccessScreen);
export const STAGE_SUCCESS_SCREEN = 'nav/STAGE_SUCCESS';
