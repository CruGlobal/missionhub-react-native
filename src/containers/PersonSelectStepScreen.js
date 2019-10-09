import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { contactAssignmentSelector, personSelector } from '../selectors/people';
import { organizationSelector } from '../selectors/organizations';

import SelectStepScreen from './SelectStepScreen';

@withTranslation('selectStep')
class PersonSelectStepScreen extends Component {
  render() {
    const {
      t,
      person,
      stageId,
      organization,
      next,
      enableSkipButton,
    } = this.props;

    return (
      <SelectStepScreen
        contactStageId={stageId}
        receiverId={person.id}
        contactName={person.first_name}
        headerText={t('personHeader', { name: person.first_name })}
        contact={person ? person : null}
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
  { auth, people, organizations },
  {
    navigation: {
      state: {
        params: { personId, orgId, enableSkipButton },
      },
    },
    next,
  },
) => {
  const isMe = auth.person.id === personId;
  const person = personSelector({ people }, { personId, orgId });
  return {
    person,
    stageId: isMe
      ? (auth.person.user || {}).pathway_stage_id
      : (contactAssignmentSelector({ auth }, { person, orgId }) || {})
          .pathway_stage_id,
    organization: organizationSelector({ organizations }, { orgId }),
    enableSkipButton,
    next,
  };
};

export default connect(mapStateToProps)(PersonSelectStepScreen);
export const PERSON_SELECT_STEP_SCREEN = 'nav/PERSON_SELECT_STEP';
