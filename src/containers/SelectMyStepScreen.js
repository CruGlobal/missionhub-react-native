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
      personId,
      contactStage,
      organization,
      onboarding,
      myStageId,
      next,
    } = this.props;

    const section = onboarding ? 'onboarding' : 'people';
    const stageId = contactStage ? contactStage.id : myStageId;

    return (
      <SelectStepScreen
        contactStageId={stageId}
        receiverId={personId}
        organization={organization}
        headerText={[t('meHeader.part1'), t('meHeader.part2')]}
        createStepTracking={buildTrackingObj(
          `${section} : self : steps : create`,
          section,
          'self',
          'steps',
        )}
        next={next}
      />
    );
  }
}

SelectMyStepScreen.propTypes = {
  contactStage: PropTypes.object,
  organization: PropTypes.object,
  next: PropTypes.func.isRequired,
};

const mapStateToProps = (
  { auth },
  {
    navigation: {
      state: {
        params: { contactStage, organization, onboarding },
      },
    },
    next,
  },
) => ({
  contactStage,
  organization,
  onboarding,
  next,
  myStageId: auth.person.user.pathway_stage_id,
  personId: auth.person.id,
});

export default connect(mapStateToProps)(SelectMyStepScreen);
export const SELECT_MY_STEP_SCREEN = 'nav/SELECT_MY_STEP';
export const SELECT_MY_STEP_ONBOARDING_SCREEN = 'nav/SELECT_MY_STEP_ONBOARDING';
