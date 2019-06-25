import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { navigateBack, navigatePush } from '../actions/navigation';
import { selectMyStage } from '../actions/selectStage';
import { SELF_VIEWED_STAGE_CHANGED } from '../constants';

import PathwayStageScreen from './PathwayStageScreen';
import { STAGE_SUCCESS_SCREEN } from './StageSuccessScreen';
import { SELECT_MY_STEP_SCREEN } from './SelectMyStepScreen';

@withTranslation('selectStage')
class StageScreen extends Component {
  onScrollToStage = trackingObj => {
    this.props.dispatch({
      type: SELF_VIEWED_STAGE_CHANGED,
      newActiveTab: trackingObj,
    });
  };

  complete(stage, isAlreadySelected = false) {
    const { onComplete, next, contactId, orgId, noNav, dispatch } = this.props;

    if (next) {
      return dispatch(next({ stage, contactId, orgId, isAlreadySelected }));
    }

    if (onComplete) {
      onComplete(stage);
      if (!noNav) {
        dispatch(
          navigatePush(SELECT_MY_STEP_SCREEN, {
            next: () => dispatch => {
              onComplete(stage);
              dispatch(navigateBack(3));
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

  handleSelectStage = async (stage, isAlreadySelected) => {
    if (!isAlreadySelected) {
      await this.props.dispatch(selectMyStage(stage.id));
    }

    this.complete(stage, isAlreadySelected);
  };

  render() {
    const {
      t,
      enableBackButton,
      firstName,
      firstItem,
      questionText,
      section,
      subsection,
    } = this.props;

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
  next: PropTypes.func,
  onComplete: PropTypes.func,
  orgId: PropTypes.string,
  questionText: PropTypes.string,
  firstItem: PropTypes.number,
  section: PropTypes.string,
  subsection: PropTypes.string,
  enableBackButton: PropTypes.bool,
  noNav: PropTypes.bool,
};

const mapStateToProps = (
  { auth, profile },
  {
    navigation: {
      state: {
        params: {
          onComplete,
          orgId,
          questionText,
          firstItem,
          section,
          subsection,
          noNav,
        },
      },
    },
    next,
  },
) => ({
  next,
  onComplete,
  orgId,
  questionText,
  firstItem,
  section,
  subsection,
  noNav,
  firstName: profile.firstName,
  contactId: auth.person.id,
});

export default connect(mapStateToProps)(StageScreen);
export const STAGE_SCREEN = 'nav/STAGE';
export const STAGE_ONBOARDING_SCREEN = 'nav/STAGE_ONBOARDING';
