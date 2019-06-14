import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import SelectStepScreen from './SelectStepScreen';

@withTranslation('selectStep')
class SelectMyStepScreen extends Component {
  render() {
    const {
      t,
      enableBackButton,
      me,
      myPersonId,
      stage,
      orgId,
      myStageId,
      next,
    } = this.props;

    const stageId = stage ? stage.id : myStageId;

    return (
      <SelectStepScreen
        contactStageId={stageId}
        receiverId={myPersonId}
        contact={me}
        organization={{ id: orgId }}
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
  orgId: PropTypes.string,
};

const mapStateToProps = (
  { auth },
  {
    navigation: {
      state: {
        params: { enableBackButton, stage, orgId },
      },
    },
    next,
  },
) => ({
  next,
  enableBackButton,
  stage,
  orgId,
  me: auth.person,
  myStageId: auth.person.user.pathway_stage_id,
  myPersonId: auth.person.id,
});

export default connect(mapStateToProps)(SelectMyStepScreen);
export const SELECT_MY_STEP_SCREEN = 'nav/SELECT_MY_STEP';
