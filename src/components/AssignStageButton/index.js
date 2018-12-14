import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { Button } from '../common';
import {
  assignContactAndPickStage,
  loadStepsAndJourney,
} from '../../actions/misc';
import { navigatePush } from '../../actions/navigation';
import { getPersonDetails, updatePersonAttributes } from '../../actions/person';
import { getStageIndex } from '../../utils/common';
import { PERSON_STAGE_SCREEN } from '../../containers/PersonStageScreen';
import { STAGE_SCREEN } from '../../containers/StageScreen';
import {
  contactAssignmentSelector,
  personSelector,
} from '../../selectors/people';

import styles from './styles';

@translate('contactHeader')
class AssignStageButton extends Component {
  render() {
    const {
      t,
      pathwayStage,
      selectMyStage,
      selectPersonStage,
      isMe,
    } = this.props;

    return (
      <Button
        type="transparent"
        onPress={isMe ? selectMyStage : selectPersonStage}
        text={(pathwayStage
          ? pathwayStage.name
          : t('selectStage')
        ).toUpperCase()}
        style={[
          styles.assignButton,
          pathwayStage ? styles.buttonWithStage : styles.buttonWithNoStage,
        ]}
        buttonTextStyle={styles.assignButtonText}
      />
    );
  }
}

AssignStageButton.propTypes = {
  person: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  selectMyStage: PropTypes.func.isRequired,
  selectPersonStage: PropTypes.func.isRequired,
};

const mapStateToProps = (
  { people, auth, stages },
  { person, organization },
) => {
  const authPerson = auth.person;
  const stagesList = stages.stages || [];

  if (authPerson.id === person.id) {
    return {
      isMe: true,
      pathwayStage: stagesList.find(
        s => s.id === `${authPerson.user.pathway_stage_id}`,
      ),
    };
  }

  const loadedPerson =
    personSelector(
      { people },
      { personId: person.id, orgId: organization.id },
    ) || person;
  const contactAssignment = contactAssignmentSelector(
    { auth },
    { person: loadedPerson, orgId: organization.id },
  );

  return {
    isMe: false,
    pathwayStage:
      contactAssignment &&
      stagesList.find(s => s.id === `${contactAssignment.pathway_stage_id}`),
  };
};

export default connect(mapStateToProps)(AssignStageButton);
