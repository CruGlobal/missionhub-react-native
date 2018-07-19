import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import { Button } from '../common';
import { navigatePush } from '../../actions/navigation';
import { PERSON_STAGE_SCREEN } from '../../containers/PersonStageScreen';
import styles from './styles';
import { contactAssignmentSelector } from '../../selectors/people';
import { createContactAssignment } from '../../actions/person';

@translate()
class AssignToMeButton extends Component {
  assignToMe = async () => {
    const { dispatch, personId, orgId, myId } = this.props;

    const { person: resultPerson } = await dispatch(
      createContactAssignment(orgId, myId, personId),
    );

    const { id: contactAssignmentId } = contactAssignmentSelector(
      { auth: { person: { id: myId } } },
      { person: resultPerson, orgId },
    );

    dispatch(
      navigatePush(PERSON_STAGE_SCREEN, {
        contactId: resultPerson.id,
        orgId: orgId,
        contactAssignmentId,
        name: resultPerson.first_name,
        onComplete: () => {},
        section: 'people',
        subsection: 'person',
      }),
    );
  };

  render() {
    const { onPress, t } = this.props;

    return (
      <Button
        type="transparent"
        onPress={this.assignToMe}
        text={t('assignToMe').toUpperCase()}
        style={styles.assignButton}
        buttonTextStyle={styles.assignButtonText}
      />
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  myId: auth.person.id,
});
export default connect(mapStateToProps)(AssignToMeButton);

AssignToMeButton.propTypes = {
  orgId: PropTypes.string.isRequired,
  personId: PropTypes.string.isRequired,
};
