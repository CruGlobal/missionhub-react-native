import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation, useTranslation } from 'react-i18next';

import { contactAssignmentSelector, personSelector } from '../selectors/people';

import SelectStepScreen from './SelectStepScreen';

const PersonSelectStepScreen = ({
  contactName,
  contactId,
  contactStage,
  contactAssignment,
  personFirstName,
  personId,
  organization,
  next,
  enableSkipButton,
}) => {
  const { t } = useTranslation('selectStep');
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
      organization={organization}
      enableSkipButton={enableSkipButton}
      next={next}
    />
  );
};

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
  { personProfile, auth, people },
  {
    navigation: {
      state: {
        params: {
          contactName,
          contactId,
          contactStage,
          organization = {},
          enableSkipButton,
        },
      },
    },
    next,
  },
) => {
  const person = personSelector(
    { people },
    { personId: contactId, orgId: organization.id },
  );

  return {
    contactName,
    contactId,
    contactStage,
    organization,
    enableSkipButton,
    next,
    personFirstName: personProfile.personFirstName,
    personId: personProfile.id,
    contactAssignment:
      person &&
      contactAssignmentSelector(
        { auth },
        {
          person,
          orgId: organization.id,
        },
      ),
  };
};

export default connect(mapStateToProps)(PersonSelectStepScreen);
export const PERSON_SELECT_STEP_SCREEN = 'nav/PERSON_SELECT_STEP';
