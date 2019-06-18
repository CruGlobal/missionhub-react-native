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
    const { dispatch, next, selectedStage } = this.props;

    disableBack.remove();

    if (next) {
      return dispatch(next({ selectedStage }));
    }

    dispatch(
      navigatePush(SELECT_MY_STEP_ONBOARDING_SCREEN, {
        onboarding: true,
        contactStage: selectedStage,
        enableBackButton: false,
        next: this.handleNavigate,
      }),
    );
  };

  getMessage() {
    const { t, selectedStage, firstName } = this.props;

    let followUpText =
      selectedStage && selectedStage.self_followup_description
        ? selectedStage.self_followup_description
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
  next: PropTypes.func.isRequired,
  selectedStage: PropTypes.object,
};

const mapStateToProps = (
  { profile },
  {
    navigation: {
      state: {
        params: { selectedStage },
      },
    },
    next,
  },
) => ({
  selectedStage,
  next,
  firstName: profile.firstName,
});

export default connect(mapStateToProps)(StageSuccessScreen);
export const STAGE_SUCCESS_SCREEN = 'nav/STAGE_SUCCESS';
