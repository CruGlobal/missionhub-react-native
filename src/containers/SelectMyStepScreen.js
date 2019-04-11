import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { buildTrackingObj } from '../utils/common';

import SelectStepScreen from './SelectStepScreen';

@withTranslation('selectStep')
class SelectMyStepScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      t,
      enableBackButton,
      me,
      personId,
      contactStage,
      organization,
      myStageId,
      next,
    } = this.props;

    const section = this.props.onboarding ? 'onboarding' : 'people';
    const stageId = contactStage ? contactStage.id : myStageId;

    return (
      <SelectStepScreen
        contactStageId={stageId}
        receiverId={personId}
        contact={me}
        organization={organization}
        headerText={t('meHeader')}
        createStepTracking={buildTrackingObj(
          `${section} : self : steps : create`,
          section,
          'self',
          'steps',
        )}
        enableBackButton={enableBackButton}
        next={next}
      />
    );
  }
}

SelectMyStepScreen.propTypes = {
  next: PropTypes.func.isRequired,
  enableBackButton: PropTypes.bool,
  contactStage: PropTypes.object,
  contactId: PropTypes.string,
  organization: PropTypes.object,
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
