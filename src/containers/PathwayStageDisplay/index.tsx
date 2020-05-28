import React, { Component } from 'react';
import { connect } from 'react-redux-legacy';
import i18next from 'i18next';
import PropTypes from 'prop-types';

import { Text } from '../../components/common';
import {
  contactAssignmentSelector,
  personSelector,
} from '../../selectors/people';
import { localizedStageSelector } from '../../selectors/stages';

import styles from './styles';

class PathwayStageDisplay extends Component {
  render() {
    // @ts-ignore
    const { pathwayStage } = this.props;

    return pathwayStage ? (
      <Text style={styles.stage}>
        {localizedStageSelector(pathwayStage, i18next.language).name}
      </Text>
    ) : null;
  }
}

// @ts-ignore
PathwayStageDisplay.propTypes = {
  person: PropTypes.object,
  orgId: PropTypes.string,
};

// @ts-ignore
const mapStateToProps = ({ people, auth, stages }, { orgId, person }) => {
  const authPerson = auth.person;
  const stagesList = stages.stages || [];

  if (authPerson.id === person.id) {
    return {
      pathwayStage: stagesList.find(
        // @ts-ignore
        s => s.id === `${authPerson.user.pathway_stage_id}`,
      ),
    };
  }

  const loadedPerson =
    personSelector({ people }, { personId: person.id }) || person;
  const contactAssignment = contactAssignmentSelector(
    { auth },
    { person: loadedPerson, orgId },
  );

  return {
    pathwayStage:
      contactAssignment &&
      // @ts-ignore
      stagesList.find(s => s.id === `${contactAssignment.pathway_stage_id}`),
  };
};

export default connect(mapStateToProps)(PathwayStageDisplay);
