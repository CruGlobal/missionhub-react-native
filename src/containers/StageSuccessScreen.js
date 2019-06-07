import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { disableBack } from '../utils/common';

import IconMessageScreen from './IconMessageScreen/index';

@withTranslation('stageSuccess')
class StageSuccessScreen extends Component {
  componentDidMount() {
    disableBack.add();
  }

  componentWillUnmount() {
    disableBack.remove();
  }

  handleNavigateNext = () => {
    const { dispatch, next, stage } = this.props;

    disableBack.remove();
    dispatch(next({ stage }));
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
        onComplete={this.handleNavigateNext}
        iconPath={require('../../assets/images/pathFinder.png')}
      />
    );
  }
}

StageSuccessScreen.propTypes = {
  next: PropTypes.func.isRequired,
  stage: PropTypes.object,
};

const mapStateToProps = ({ profile }, { navigation }) => ({
  ...(navigation.state.params || {}),
  firstName: profile.firstName,
});

export default connect(mapStateToProps)(StageSuccessScreen);
export const STAGE_SUCCESS_SCREEN = 'nav/STAGE_SUCCESS';
