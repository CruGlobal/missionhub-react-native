import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { Button } from '../common';
import {
  contactAssignmentSelector,
  personSelector,
} from '../../selectors/people';
import { navigateToStageScreen } from '../../actions/misc';
import { getStageIndex } from '../../utils/common';

import styles from './styles';

@translate('contactHeader')
class AssignStageButton extends Component {
  assignStage = () => {
    const {
      dispatch,
      isMe,
      person,
      contactAssignment = null,
      organization,
      firstItemIndex,
    } = this.props;

    dispatch(
      navigateToStageScreen(
        isMe,
        person,
        contactAssignment,
        organization,
        firstItemIndex,
      ),
    );
  };

  render() {
    const { t, pathwayStage } = this.props;

    return (
      <Button
        type="transparent"
        onPress={this.assignStage}
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
};

const mapStateToProps = (
  { people, auth, stages },
  { person = {}, organization = {} },
) => {
  const personId = person.id;
  const orgId = organization.id;
  const authPerson = auth.person;
  const stagesList = stages.stages || [];

  if (authPerson.id === personId) {
    const myStageId = authPerson.user.pathway_stage_id;
    return {
      isMe: true,
      pathwayStage: stagesList.find(s => s.id === `${myStageId}`),
      firstItemIndex: getStageIndex(stagesList, myStageId),
    };
  }

  const loadedPerson =
    personSelector({ people }, { personId, orgId }) || person;
  const contactAssignment = contactAssignmentSelector(
    { auth },
    { person: loadedPerson, orgId },
  );
  const personStageId = contactAssignment && contactAssignment.pathway_stage_id;

  return {
    isMe: false,
    pathwayStage:
      contactAssignment && stagesList.find(s => s.id === `${personStageId}`),
    firstItemIndex:
      contactAssignment && getStageIndex(stagesList, personStageId),
    contactAssignment,
  };
};

export default connect(mapStateToProps)(AssignStageButton);
