import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { contactAssignmentSelector } from '../selectors/people';

import SelectStepScreen from './SelectStepScreen';

@withTranslation('selectStep')
class PersonSelectStepScreen extends Component {
  render() {
    const {
      t,
      contactName,
      personFirstName,
      contactStage,
      contactAssignment,
      contactId,
      personId,
      contact,
      organization,
      next,
      enableSkipButton,
    } = this.props;

    const name = contactName ? contactName : personFirstName;
    const stageId = contactAssignment
      ? contactAssignment.pathway_stage_id
      : contactStage.id;

    return (
      <SelectStepScreen
        contactStageId={stageId}
        receiverId={contactId ? contactId : personId}
        contactName={name}
        headerText={t('personHeader', { name })}
        contact={contact ? contact : null}
        organization={organization}
        enableSkipButton={enableSkipButton}
        next={next}
      />
    );
  }
}

PersonSelectStepScreen.defaultProps = {
  enableSkipButton: false,
};

PersonSelectStepScreen.propTypes = {
  contactName: PropTypes.string,
  contactId: PropTypes.string,
  contactStage: PropTypes.object,
  contact: PropTypes.object,
  organization: PropTypes.object,
  enableSkipButton: PropTypes.bool,
  next: PropTypes.func.isRequired,
};

const mapStateToProps = (
  { personProfile, auth },
  {
    navigation: {
      state: {
        params: {
          contactName,
          contactId,
          contactStage,
          contact,
          organization = {},
          enableSkipButton,
        },
      },
    },
    next,
  },
) => ({
  contactName,
  contactId,
  contactStage,
  contact,
  organization,
  enableSkipButton,
  next,
  personFirstName: personProfile.personFirstName,
  personId: personProfile.id,
  contactAssignment:
    contact &&
    contactAssignmentSelector(
      { auth },
      { person: contact, orgId: organization.id },
    ),
});

export default connect(mapStateToProps)(PersonSelectStepScreen);
export const PERSON_SELECT_STEP_SCREEN = 'nav/PERSON_SELECT_STEP';
