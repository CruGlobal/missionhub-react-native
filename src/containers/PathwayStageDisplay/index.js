import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Text } from '../../components/common';
import {
  contactAssignmentSelector,
  personSelector,
} from '../../selectors/people';

import styles from './styles';

class PathwayStageDisplay extends Component {
  render() {
    const { pathwayStage } = this.props;

    return pathwayStage ? (
      <Text style={styles.stage}>{pathwayStage.name}</Text>
    ) : null;
  }
}

PathwayStageDisplay.propTypes = {
  person: PropTypes.object,
  orgId: PropTypes.string,
};

const mapStateToProps = ({ people, auth, stages }, { orgId, person }) => {
  const authPerson = auth.person;
  const stagesList = stages.stages;

  if (authPerson.id === person.id) {
    return {
      pathwayStage: stagesList.find(
        s => s.id === `${authPerson.user.pathway_stage_id}`,
      ),
    };
  }

  const loadedPerson =
    personSelector({ people }, { personId: person.id, orgId }) || person;
  const contactAssignment = contactAssignmentSelector(
    { auth },
    { person: loadedPerson, orgId },
  );

  return {
    pathwayStage:
      contactAssignment &&
      stagesList.find(s => s.id === `${contactAssignment.pathway_stage_id}`),
  };
};

export default connect(mapStateToProps)(PathwayStageDisplay);
