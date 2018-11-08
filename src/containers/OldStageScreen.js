import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { navigateBack, navigatePush } from '../actions/navigation';
import { selectMyStage } from '../actions/selectStage';

import PathwayStageScreen from './StageScreen';
import { STAGE_SUCCESS_SCREEN } from './StageSuccessScreen';
import { SELECT_MY_STEP_SCREEN } from './SelectMyStepScreen';

@translate('selectStage')
class StageScreen extends Component {
  complete(stage) {
    const { onComplete, noNav, dispatch } = this.props;

    if (onComplete) {
      onComplete(stage);
      if (!noNav) {
        dispatch(
          navigatePush(SELECT_MY_STEP_SCREEN, {
            onSaveNewSteps: () => {
              onComplete(stage);
              dispatch(navigateBack(2));
            },
            enableBackButton: true,
            contactStage: stage,
          }),
        );
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
    const {
      person,
      trackAsOnboarding,
      enableBackButton,
      firstItem,
    } = this.props;

    return (
      <PathwayStageScreen
        person={person}
        onSelect={this.handleSelectStage}
        firstItem={firstItem}
        enableBackButton={enableBackButton}
        trackAsOnboarding={trackAsOnboarding}
      />
    );
  }
}

StageScreen.propTypes = {
  onComplete: PropTypes.func,
  firstItem: PropTypes.number,
  enableBackButton: PropTypes.bool,
  noNav: PropTypes.bool,
};

const mapStateToProps = (_, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(StageScreen);
export const STAGE_SCREEN = 'nav/STAGE';
export const STAGE_ONBOARDING_SCREEN = 'nav/STAGE_ONBOARDING';
