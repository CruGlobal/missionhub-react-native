import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import PathwayStageScreen from './PathwayStageScreen';
import { selectPersonStage, updateUserStage } from '../actions/selectStage';
import { navigatePush } from '../actions/navigation';
import { buildTrackingObj, isAndroid } from '../utils/common';
import { NOTIFICATION_PRIMER_SCREEN } from './NotificationPrimerScreen';
import { PERSON_SELECT_STEP_SCREEN } from './PersonSelectStepScreen';
import { trackAction, trackState } from '../actions/analytics';
import { CELEBRATION_SCREEN } from './CelebrationScreen';
import { ACTIONS } from '../constants';
import { CONTACT_SCREEN } from './ContactScreen';

@translate('selectStage')
class PersonStageScreen extends Component {

  celebrateAndFinish = () => {
    let celebrationProps = {};
    if (this.props.onCompleteCelebration) {
      celebrationProps.onComplete = this.props.onCompleteCelebration;
    }
    this.props.dispatch(navigatePush(CELEBRATION_SCREEN, celebrationProps));
  };

  celebrateAndFinishOnboarding = () => {
    this.celebrateAndFinish();

    this.props.dispatch(trackState(buildTrackingObj('onboarding : complete', 'onboarding')));
    this.props.dispatch(trackAction(ACTIONS.ONBOARDING_COMPLETE));
  };

  handleNavigate = () => {
    if (this.props.addingContactFlow) {
      this.celebrateAndFinish();
      return;
    }
    // Android doesn't need a primer for notifications the way iOS does
    if (!isAndroid && !this.props.hasAskedPushNotifications) {
      this.props.dispatch(navigatePush(NOTIFICATION_PRIMER_SCREEN, {
        onComplete: this.celebrateAndFinishOnboarding,
      }));
    } else {
      this.celebrateAndFinishOnboarding();
    }
  };

  complete(stage) {
    const { onComplete, noNav, dispatch, contactId, orgId, name } = this.props;

    onComplete(stage);
    if (!noNav) {
      dispatch(navigatePush(PERSON_SELECT_STEP_SCREEN, {
        onSaveNewSteps: () => dispatch(navigatePush(CONTACT_SCREEN, { person: { id: contactId }, organization: { id: orgId } })),
        contactStage: stage,
        createStepTracking: buildTrackingObj('people : person : steps : create', 'people', 'person', 'steps'),
        contactName: name,
        contactId: contactId,
        organization: { id: orgId },
      }));
      dispatch(trackState(buildTrackingObj('people : person : steps : add', 'people', 'person', 'steps')));
    }
  }

  handleSelectStage = async(stage, isAlreadySelected) => {
    if (this.props.onComplete) {
      if (isAlreadySelected) {
        this.complete(stage);
      } else {
        this.props.contactAssignmentId ?
          await this.props.dispatch(updateUserStage(this.props.contactAssignmentId, stage.id)) :
          await this.props.dispatch(selectPersonStage(this.props.contactId || this.props.personId, this.props.myId, stage.id, this.props.orgId));
        this.complete(stage);
      }
    } else if (this.props.addingContactFlow) {
      this.props.dispatch(updateUserStage(this.props.contactAssignmentId, stage.id)).then(() => {
        this.props.dispatch(navigatePush(PERSON_SELECT_STEP_SCREEN, {
          onSaveNewSteps: this.handleNavigate,
          contactStage: stage,
          createStepTracking: buildTrackingObj('people : add person : steps : create', 'people', 'add person', 'steps'),
          contactName: this.props.name,
          contactId: this.props.contactId,
          organization: { id: this.props.orgId },
        }));
      });
      this.props.dispatch(trackState(buildTrackingObj('people : add person : steps : add', 'people', 'add person', 'steps')));

    } else {
      this.props.dispatch(selectPersonStage(this.props.contactId || this.props.personId, this.props.myId, stage.id)).then(() => {

        this.props.dispatch(navigatePush(PERSON_SELECT_STEP_SCREEN, {
          onSaveNewSteps: this.handleNavigate,
          contactStage: stage,
          contactName: this.props.name,
          contactId: this.props.contactId,
          createStepTracking: buildTrackingObj('onboarding : add person : steps : create', 'onboarding', 'add person', 'steps'),
        }));

        const trackingObj = buildTrackingObj('onboarding : add person : steps : add', 'onboarding', 'add person', 'steps');
        this.props.dispatch(trackState(trackingObj));
      });
    }
  };

  render() {
    const { t, name, personFirstName, enableBackButton, section, subsection, questionText, firstItem } = this.props;
    const personName = name || personFirstName;

    return (
      <PathwayStageScreen
        buttonText={t('here').toUpperCase()}
        activeButtonText={t('stillHere').toUpperCase()}
        questionText={questionText || t('personQuestion', { name: personName })}
        onSelect={this.handleSelectStage}
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

const mapStateToProps = ({ personProfile, auth }, { navigation }) => ({
  ...(navigation.state.params || {}),
  personFirstName: personProfile.personFirstName,
  personId: personProfile.id,
  myId: auth.personId,
});

export default connect(mapStateToProps)(PersonStageScreen);
export const PERSON_STAGE_SCREEN = 'nav/PERSON_STAGE';
