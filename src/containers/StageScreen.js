import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { navigateBack, navigatePush } from '../actions/navigation';
import { selectMyStage } from '../actions/selectStage';
import { SELF_VIEWED_STAGE_CHANGED } from '../constants';

import PathwayStageScreen from './PathwayStageScreen';
import { STAGE_SUCCESS_SCREEN } from './StageSuccessScreen';
import { SELECT_MY_STEP_SCREEN } from './SelectMyStepScreen';

@translate('selectStage')
class StageScreen extends Component {

  onScrollToStage = (trackingObj) => {
    this.props.dispatch({ type: SELF_VIEWED_STAGE_CHANGED, newActiveTab: trackingObj });
  };

  complete(stage) {
    const { onComplete, noNav, dispatch } = this.props;

    if (onComplete) {
      onComplete(stage);
      if (!noNav) {
        dispatch(navigatePush(SELECT_MY_STEP_SCREEN, {
          onSaveNewSteps: () => dispatch(navigateBack(2)),
          enableBackButton: true,
          contactStage: stage,
        }));
      }
    } else {
      dispatch(navigatePush(STAGE_SUCCESS_SCREEN, { selectedStage: stage }));
    }
  }

  handleSelectStage = (stage, isAlreadySelected) => {
    if (isAlreadySelected) {
      this.complete(stage);
    } else {
      this.props.dispatch(selectMyStage(stage.id)).then(() => {
        this.complete(stage);
      });
    }
  };

  render() {
    const { t, enableBackButton, firstName, firstItem, questionText, section, subsection } = this.props;

    return (
      <PathwayStageScreen
        buttonText={t('iAmHere').toUpperCase()}
        activeButtonText={t('stillHere').toUpperCase()}
        questionText={questionText || t('meQuestion', { name: firstName })}
        onSelect={this.handleSelectStage}
        onScrollToStage={this.onScrollToStage}
        section={section}
        firstItem={firstItem}
        subsection={subsection}
        enableBackButton={enableBackButton}
        isSelf
      />
    );
  }

}

StageScreen.propTypes = {
  onComplete: PropTypes.func,
  contactId: PropTypes.string,
  questionText: PropTypes.string,
  firstItem: PropTypes.number,
  section: PropTypes.string,
  subsection: PropTypes.string,
  enableBackButton: PropTypes.bool,
  noNav: PropTypes.bool,
};

const mapStateToProps = ({ profile }, { navigation } ) => ({
  ...(navigation.state.params || {}),
  firstName: profile.firstName,
});

export default connect(mapStateToProps)(StageScreen);
export const STAGE_SCREEN = 'nav/STAGE';
export const STAGE_ONBOARDING_SCREEN = 'nav/STAGE_ONBOARDING';
