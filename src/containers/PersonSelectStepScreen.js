import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

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
      contactId,
      personId,
      contact,
      organization,
      createStepTracking,
    } = this.props;

    const name = contactName ? contactName : personFirstName;

    return (
      <SelectStepScreen
        isMe={false}
        contactStage={contactStage}
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

const mapStateToProps = ({ personProfile, auth }, { navigation }) => ({
  ...(navigation.state.params || {}),
  myId: auth.person.id,
  personFirstName: personProfile.personFirstName,
  personId: personProfile.id,
});

export default connect(mapStateToProps)(PersonSelectStepScreen);
export const PERSON_SELECT_STEP_SCREEN = 'nav/PERSON_SELECT_STEP';
