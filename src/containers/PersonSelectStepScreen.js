import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { getFourRandomItems } from '../utils/common';

import SelectStepScreen from './SelectStepScreen';

@translate('selectStep')
class PersonSelectStepScreen extends Component {
  constructor(props) {
    super(props);
  }

  insertName(steps) {
    return steps.map(step => ({
      ...step,
      body: step.body.replace(
        '<<name>>',
        this.props.contactName
          ? this.props.contactName
          : this.props.personFirstName,
      ),
    }));
  }

  handleNavigate = () => {
    this.props.onSaveNewSteps();
  };

  render() {
    const name = this.props.contactName
      ? this.props.contactName
      : this.props.personFirstName;

    return (
      <SelectStepScreen
        isMe={false}
        contactStage={this.props.contactStage}
        receiverId={
          this.props.contactId ? this.props.contactId : this.props.personId
        }
        useOthersSteps={true}
        headerText={this.props.t('personHeader', { name })}
        contact={this.props.contact ? this.props.contact : null}
        organization={this.props.organization}
        onComplete={this.handleNavigate}
        createStepTracking={this.props.createStepTracking}
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

const mapStateToProps = ({ steps, personProfile, auth }, { navigation }) => ({
  ...(navigation.state.params || {}),
  myId: auth.person.id,
  suggestedForOthers: steps.suggestedForOthers,
  personFirstName: personProfile.personFirstName,
  personId: personProfile.id,
});

export default connect(mapStateToProps)(PersonSelectStepScreen);
export const PERSON_SELECT_STEP_SCREEN = 'nav/PERSON_SELECT_STEP';
