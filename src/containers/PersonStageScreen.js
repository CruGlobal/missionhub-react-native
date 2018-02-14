import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import PathwayStageScreen from './PathwayStageScreen';
import { selectPersonStage, updateUserStage } from '../actions/selectStage';
import { navigatePush, navigateBack } from '../actions/navigation';
import { buildTrackingObj, isAndroid } from '../utils/common';
import { NOTIFICATION_PRIMER_SCREEN } from './NotificationPrimerScreen';
import { PERSON_SELECT_STEP_SCREEN } from './PersonSelectStepScreen';
import { MAIN_TABS } from '../constants';
import { trackState } from '../actions/analytics';
import { CELEBRATION_SCREEN } from './CelebrationScreen';

@translate('selectStage')
class PersonStageScreen extends Component {
  constructor(props) {
    super(props);

    this.handleSelectStage = this.handleSelectStage.bind(this);
  }

  handleNavigate = () => {
    // Android doesn't need a primer for notifications the way iOS does
    if (!isAndroid && !this.props.hasAskedPushNotifications) {
      this.props.dispatch(navigatePush(NOTIFICATION_PRIMER_SCREEN, {
        onComplete: () => {
          this.props.dispatch(navigatePush(CELEBRATION_SCREEN));
        },
      }));
    } else {
      this.props.dispatch(navigatePush(MAIN_TABS));
    }
  }

  handleSelectStage(stage) {
    if (this.props.onComplete) {
      this.props.dispatch(updateUserStage(this.props.contactAssignmentId, stage.id)).then(()=>{
        this.props.onComplete(stage);
        this.props.dispatch(navigateBack());
      });
    } else {
      this.props.dispatch(selectPersonStage(this.props.contactId || this.props.personId, this.props.myId, stage.id)).then(() => {
        this.props.dispatch(navigatePush(PERSON_SELECT_STEP_SCREEN, {
          onSaveNewSteps: this.handleNavigate,
          createStepTracking: buildTrackingObj('onboarding : add person : steps : create', 'add person', 'steps'),
        }));

        const trackingObj = buildTrackingObj('onboarding : add person : steps : add', 'onboarding', 'add person', 'steps');
        this.props.dispatch(trackState(trackingObj));
      });
    }
  }

  render() {
    const { t, name, personFirstName, enableBackButton, section, subsection } = this.props;
    const personName = name || personFirstName;

    return (
      <PathwayStageScreen
        buttonText={t('here').toUpperCase()}
        questionText={t('personQuestion', { name: personName })}
        onSelect={this.handleSelectStage}
        section={section}
        subsection={subsection}
        enableBackButton={enableBackButton}
      />
    );
  }

}


PersonStageScreen.propTypes = {
  onComplete: PropTypes.func,
  name: PropTypes.string,
  contactId: PropTypes.string,
  currentStage: PropTypes.string,
  contactAssignmentId: PropTypes.string,
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
