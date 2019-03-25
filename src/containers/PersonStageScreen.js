import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { selectPersonStage, updateUserStage } from '../actions/selectStage';
import { navigateBack, navigatePush } from '../actions/navigation';
import { buildTrackingObj, isAndroid } from '../utils/common';
import { trackActionWithoutData } from '../actions/analytics';
import { ACTIONS, PERSON_VIEWED_STAGE_CHANGED } from '../constants';
import { completeOnboarding } from '../actions/onboardingProfile';

import { NOTIFICATION_PRIMER_SCREEN } from './NotificationPrimerScreen';
import { PERSON_SELECT_STEP_SCREEN } from './PersonSelectStepScreen';
import { CELEBRATION_SCREEN } from './CelebrationScreen';
import PathwayStageScreen from './PathwayStageScreen';

@translate('selectStage')
class PersonStageScreen extends Component {
  onScrollToStage = trackingObj => {
    this.props.dispatch({
      type: PERSON_VIEWED_STAGE_CHANGED,
      newActiveTab: trackingObj,
    });
  };

  celebrateAndFinish = () => {
    const celebrationProps = {
      trackingObj: buildTrackingObj('onboarding : complete', 'onboarding'),
    };
    if (this.props.onCompleteCelebration) {
      celebrationProps.onComplete = this.props.onCompleteCelebration;
    }
    this.props.dispatch(navigatePush(CELEBRATION_SCREEN, celebrationProps));
  };

  celebrateAndFinishOnboarding = () => {
    this.celebrateAndFinish();

    this.props.dispatch(trackActionWithoutData(ACTIONS.ONBOARDING_COMPLETE));
  };

  handleNavigate = () => dispatch => {
    if (this.props.addingContactFlow) {
      this.celebrateAndFinish();
      return;
    }
    // Android doesn't need a primer for notifications the way iOS does
    if (!isAndroid) {
      dispatch(
        navigatePush(NOTIFICATION_PRIMER_SCREEN, {
          next: this.celebrateAndFinishOnboarding,
        }),
      );
    } else {
      this.celebrateAndFinishOnboarding();
    }
  };

  complete(stage, isAlreadySelected) {
    const {
      onComplete,
      next,
      noNav,
      dispatch,
      contactId,
      orgId,
      contactAssignmentId,
      name,
    } = this.props;

    if (next) {
      return dispatch(
        next({
          stage,
          contactStage: stage,
          contactId,
          name,
          orgId,
          isAlreadySelected,
          contactAssignmentId,
        }),
      );
    }

    if (onComplete) {
      onComplete(stage);
      if (!noNav) {
        dispatch(
          navigatePush(PERSON_SELECT_STEP_SCREEN, {
            next: () => dispatch => {
              onComplete(stage);
              dispatch(navigateBack(3));
            },
            contactStage: stage,
            createStepTracking: buildTrackingObj(
              'people : person : steps : create',
              'people',
              'person',
              'steps',
            ),
            contactName: name,
            contactId: contactId,
            organization: { id: orgId },
            trackingObj: buildTrackingObj(
              'people : person : steps : add',
              'people',
              'person',
              'steps',
            ),
          }),
        );
      }
    }
  }

  handleSelectStage = async (stage, isAlreadySelected) => {
    const { dispatch, contactAssignmentId, next } = this.props;

    if (next) {
      if (!isAlreadySelected) {
        await dispatch(updateUserStage(contactAssignmentId, stage.id));
      }

      return this.complete(stage, isAlreadySelected);
    }

    if (this.props.onComplete) {
      if (isAlreadySelected) {
        this.complete(stage);
      } else {
        this.props.contactAssignmentId
          ? await this.props.dispatch(
              updateUserStage(this.props.contactAssignmentId, stage.id),
            )
          : await this.props.dispatch(
              selectPersonStage(
                this.props.contactId || this.props.personId,
                this.props.myId,
                stage.id,
                this.props.orgId,
              ),
            );
        this.complete(stage);
      }
    } else {
      const trackingScreen = this.props.addingContactFlow
        ? 'people'
        : 'onboarding';

      this.props
        .dispatch(updateUserStage(this.props.contactAssignmentId, stage.id))
        .then(() => {
          this.props.dispatch(
            navigatePush(PERSON_SELECT_STEP_SCREEN, {
              contactStage: stage,
              createStepTracking: buildTrackingObj(
                `${trackingScreen} : add person : steps : create`,
                trackingScreen,
                'add person',
                'steps',
              ),
              contactName: this.props.name,
              contactId: this.props.contactId,
              organization: { id: this.props.orgId },
              trackingObj: buildTrackingObj(
                `${trackingScreen} : add person : steps : add`,
                trackingScreen,
                'add person',
                'steps',
              ),
              next: this.handleNavigate,
            }),
          );

          if (!this.props.addingContactFlow) {
            this.props.dispatch(completeOnboarding());
          }
        });
    }
  };

  render() {
    const {
      t,
      name,
      personFirstName,
      enableBackButton,
      section,
      subsection,
      questionText,
      firstItem,
    } = this.props;
    const personName = name || personFirstName;

    return (
      <PathwayStageScreen
        buttonText={t('here').toUpperCase()}
        activeButtonText={t('stillHere').toUpperCase()}
        questionText={questionText || t('personQuestion', { name: personName })}
        onSelect={this.handleSelectStage}
        onScrollToStage={this.onScrollToStage}
        firstItem={firstItem}
        section={section}
        subsection={subsection}
        enableBackButton={enableBackButton}
      />
    );
  }
}

PersonStageScreen.propTypes = {
  onComplete: PropTypes.func,
  onCompleteCelebration: PropTypes.func,
  name: PropTypes.string,
  contactId: PropTypes.string,
  currentStage: PropTypes.string,
  contactAssignmentId: PropTypes.string,
  orgId: PropTypes.string,
  firstItem: PropTypes.number,
  enableBackButton: PropTypes.bool,
  noNav: PropTypes.bool,
  addingContactFlow: PropTypes.bool,
};
PersonStageScreen.defaultProps = {
  enableBackButton: true,
};

const mapStateToProps = ({ personProfile, auth }, { navigation }) => {
  const navProps = navigation.state.params || {};

  return {
    ...navProps,
    personFirstName: personProfile.personFirstName,
    personId: personProfile.id,
    contactAssignmentId: navProps.onComplete
      ? navProps.contactAssignmentId
      : navProps.contactAssignmentId || personProfile.contactAssignmentId, // onComplete currently seems to be used as a flag to indicate if we are in onboarding or not
    myId: auth.person.id,
  };
};

export default connect(mapStateToProps)(PersonStageScreen);
export const PERSON_STAGE_SCREEN = 'nav/PERSON_STAGE';
