import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { contactAssignmentSelector } from '../selectors/people';

import SelectStepScreen from './SelectStepScreen';

@translate('selectStep')
class PersonSelectStepScreen extends Component {
  constructor(props) {
    super(props);
  }

  handleNavigate = () => {
    this.props.onSaveNewSteps();
  };

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
      createStepTracking,
    } = this.props;

    const name = contactName ? contactName : personFirstName;
    const stageId = contactAssignment
      ? contactAssignment.pathway_stage_id
      : contactStage.id;

    return (
      <SelectStepScreen
        isMe={false}
        contactStageId={stageId}
        receiverId={contactId ? contactId : personId}
        contactName={name}
        headerText={t('personHeader', { name })}
        contact={contact ? contact : null}
        organization={organization}
        onComplete={this.handleNavigate}
        createStepTracking={createStepTracking}
        enableBackButton
      />
    );
  }
}

PersonSelectStepScreen.propTypes = {
  contactName: PropTypes.string,
  contactId: PropTypes.string,
  createStepTracking: PropTypes.object.isRequired,
  contact: PropTypes.object,
  organization: PropTypes.object,
  onSaveNewSteps: PropTypes.func,
};

const mapStateToProps = ({ personProfile, auth }, { navigation }) => {
  const navParams = navigation.state.params || {};
  const { contact, organization = {} } = navParams;

  return {
    ...navParams,
    myId: auth.person.id,
    personFirstName: personProfile.personFirstName,
    personId: personProfile.id,
    contactAssignment:
      contact &&
      contactAssignmentSelector(
        { auth },
        { person: contact, orgId: organization.id },
      ),
  };
};

export default connect(mapStateToProps)(PersonSelectStepScreen);
export const PERSON_SELECT_STEP_SCREEN = 'nav/PERSON_SELECT_STEP';
