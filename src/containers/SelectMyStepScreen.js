import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { buildTrackingObj } from '../utils/common';

import SelectStepScreen from './SelectStepScreen';

@translate('selectStep')
class SelectMyStepScreen extends Component {
  constructor(props) {
    super(props);
  }

  handleNavigate = () => {
    const { dispatch, next, onSaveNewSteps } = this.props;

    if (next) {
      dispatch(next());
    } else if (onSaveNewSteps) {
      onSaveNewSteps();
    }
  };

  render() {
    const {
      t,
      enableBackButton,
      me,
      personId,
      contactStage,
      organization,
      myStageId,
    } = this.props;

    const section = this.props.onboarding ? 'onboarding' : 'people';
    const stageId = contactStage ? contactStage.id : myStageId;

    return (
      <SelectStepScreen
        isMe={true}
        contactStageId={stageId}
        receiverId={personId}
        contact={me}
        organization={organization}
        onComplete={this.handleNavigate}
        headerText={t('meHeader')}
        createStepTracking={buildTrackingObj(
          `${section} : self : steps : create`,
          section,
          'self',
          'steps',
        )}
        enableBackButton={enableBackButton}
      />
    );
  }
}

SelectMyStepScreen.propTypes = {
  next: PropTypes.func,
  onSaveNewSteps: PropTypes.func,
  enableBackButton: PropTypes.bool,
  contactStage: PropTypes.object.isRequired,
};

const mapStateToProps = ({ auth }, { navigation }) => ({
  ...(navigation.state.params || {}),
  me: auth.person,
  myStageId: auth.person.user.pathway_stage_id,
  personId: auth.person.id,
});

export default connect(mapStateToProps)(SelectMyStepScreen);
export const SELECT_MY_STEP_SCREEN = 'nav/SELECT_MY_STEP';
export const SELECT_MY_STEP_ONBOARDING_SCREEN = 'nav/SELECT_MY_STEP_ONBOARDING';
