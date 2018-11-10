import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import { personSelector } from '../selectors/people';
import { stageSelector } from '../selectors/stages';

import IconMessageScreen from './IconMessageScreen/index';

@translate('stageSuccess')
class StageSuccessScreen extends Component {
  handleNavigateToStep = () => {
    const { dispatch, next, person, stage } = this.props;

    dispatch(next({ personId: person.id, stageId: stage.id }));
  };

  getMessage() {
    const { t, stage, person } = this.props;

    let followUpText =
      stage && stage.self_followup_description
        ? stage.self_followup_description
        : t('backupMessage');
    followUpText = followUpText.replace(
      '<<user>>',
      person.first_name || t('friend'),
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
  next: PropTypes.func.isRequired,
  person: PropTypes.object.isRequired,
  stage: PropTypes.object.isRequired,
};

const mapStateToProps = ({ people, stages }, { navigation }) => {
  const { personId, stageId } = navigation.state.params || {};

  return {
    person: personSelector({ people }, { personId }),
    stage: stageSelector({ stages }, { stageId }),
  };
};

export default connect(mapStateToProps)(StageSuccessScreen);
export const STAGE_SUCCESS_SCREEN = 'nav/STAGE_SUCCESS';
