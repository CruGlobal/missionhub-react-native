import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { selectPersonStage, updateUserStage } from '../actions/selectStage';
import { showReminderOnLoad } from '../actions/notifications';
import { navigateBack, navigatePush } from '../actions/navigation';
import { buildTrackingObj } from '../utils/common';
import { trackActionWithoutData } from '../actions/analytics';
import {
  ACTIONS,
  PERSON_VIEWED_STAGE_CHANGED,
  NOTIFICATION_PROMPT_TYPES,
} from '../constants';
import { completeOnboarding } from '../actions/onboardingProfile';

import { PERSON_SELECT_STEP_SCREEN } from './PersonSelectStepScreen';
import { CELEBRATION_SCREEN } from './CelebrationScreen';
import PathwayStageScreen from './PathwayStageScreen';

@withTranslation('selectStage')
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

  handleNavigate = async () => {
    const { dispatch, addingContactFlow } = this.props;

    if (addingContactFlow) {
      return this.celebrateAndFinish();
    }

    await dispatch(
      showReminderOnLoad(NOTIFICATION_PROMPT_TYPES.ONBOARDING, true),
    );

    this.celebrateAndFinishOnboarding();
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
    const {
      dispatch,
      contactId,
      personId,
      myId,
      orgId,
      contactAssignmentId,
      addingContactFlow,
      name,
      onComplete,
      next,
    } = this.props;

    if (next) {
      if (!isAlreadySelected) {
        await dispatch(updateUserStage(contactAssignmentId, stage.id));
      }
      return this.complete(stage, isAlreadySelected);
    }

    if (onComplete) {
      if (!isAlreadySelected) {
        await dispatch(
          contactAssignmentId
            ? updateUserStage(contactAssignmentId, stage.id)
            : selectPersonStage(contactId || personId, myId, stage.id, orgId),
        );
      }
      this.complete(stage);
    } else {
      const trackingScreen = addingContactFlow ? 'people' : 'onboarding';

      await dispatch(updateUserStage(contactAssignmentId, stage.id));
      dispatch(
        navigatePush(PERSON_SELECT_STEP_SCREEN, {
          contactStage: stage,
          createStepTracking: buildTrackingObj(
            `${trackingScreen} : add person : steps : create`,
            trackingScreen,
            'add person',
            'steps',
          ),
          contactName: name,
          contactId: contactId,
          organization: { id: orgId },
          trackingObj: buildTrackingObj(
            `${trackingScreen} : add person : steps : add`,
            trackingScreen,
            'add person',
            'steps',
          ),
          next: this.handleNavigate,
        }),
      );
      if (!addingContactFlow) {
        dispatch(completeOnboarding());
      }
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
  section: PropTypes.string,
  subsection: PropTypes.string,
  next: PropTypes.func,
};

PersonStageScreen.defaultProps = {
  enableBackButton: true,
};

const mapStateToProps = (
  { personProfile, auth },
  {
    navigation: {
      state: {
        params: {
          onComplete,
          onCompleteCelebration,
          name,
          contactId,
          currentStage,
          contactAssignmentId,
          orgId,
          firstItem,
          enableBackButton,
          noNav,
          addingContactFlow,
          section,
          subsection,
          questionText,
        },
      },
    },
    next,
  },
) => ({
  onComplete,
  onCompleteCelebration,
  name,
  contactId,
  currentStage,
  contactAssignmentId,
  orgId,
  firstItem,
  enableBackButton,
  noNav,
  addingContactFlow,
  section,
  subsection,
  questionText,
  next,
  personFirstName: personProfile.personFirstName,
  personId: personProfile.id,
  contactAssignmentId: onComplete
    ? contactAssignmentId
    : contactAssignmentId || personProfile.contactAssignmentId, // onComplete currently seems to be used as a flag to indicate if we are in onboarding or not
  myId: auth.person.id,
});

export default connect(mapStateToProps)(PersonStageScreen);
export const PERSON_STAGE_SCREEN = 'nav/PERSON_STAGE';
