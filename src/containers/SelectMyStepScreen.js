import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { buildTrackingObj } from '../utils/common';

import SelectStepScreen from './SelectStepScreen';

@withTranslation('selectStep')
class SelectMyStepScreen extends Component {
  render() {
    const {
      t,
      onboarding,
      enableBackButton,
      me,
      personId,
      stage,
      organization,
      myStageId,
      next,
    } = this.props;

    const section = onboarding ? 'onboarding' : 'people';
    const stageId = stage ? stage.id : myStageId;

    return (
      <SelectStepScreen
        contactStageId={stageId}
        receiverId={personId}
        contact={me}
        organization={organization}
        headerText={t('meHeader')}
        enableBackButton={enableBackButton}
        next={next}
      />
    );
  }
}

SelectMyStepScreen.defaultProps = {
  enableBackButton: true,
};

SelectMyStepScreen.propTypes = {
  next: PropTypes.func.isRequired,
  enableBackButton: PropTypes.bool,
  stage: PropTypes.object,
  organization: PropTypes.object,
  onboarding: PropTypes.bool,
};

const mapStateToProps = ({ auth }, { navigation }) => ({
  ...(navigation.state.params || {}),
  me: auth.person,
  myStageId: auth.person.user.pathway_stage_id,
  personId: auth.person.id,
});

export default connect(mapStateToProps)(SelectMyStepScreen);
export const SELECT_MY_STEP_SCREEN = 'nav/SELECT_MY_STEP';
