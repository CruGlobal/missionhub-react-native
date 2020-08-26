import React, { Component } from 'react';
import { connect } from 'react-redux-legacy';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import { Text } from 'react-native';

import {
  contactAssignmentSelector,
  personSelector,
} from '../../selectors/people';
import { localizedStageSelector } from '../../selectors/stages';
import { RootState } from '../../reducers';
import { Person } from '../../reducers/people';
import { getAuthPerson } from '../../auth/authUtilities';

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

const mapStateToProps = (
  { people, stages }: RootState,
  { person }: { person: Person },
) => {
  const authPerson = getAuthPerson();
  const stagesList = stages.stages || [];

  if (authPerson?.id === person.id) {
    return {
      pathwayStage: stagesList.find(s => s.id === authPerson?.stage?.id),
    };
  }

  const loadedPerson =
    personSelector({ people }, { personId: person.id }) || person;
  const contactAssignment = contactAssignmentSelector({ person: loadedPerson });

  return {
    pathwayStage:
      contactAssignment &&
      stagesList.find(s => s.id === `${contactAssignment.pathway_stage_id}`),
  };
};

export default connect(mapStateToProps)(PathwayStageDisplay);
