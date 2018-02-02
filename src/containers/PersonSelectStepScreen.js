import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import SelectStepScreen from './SelectStepScreen';
import { getStepSuggestions } from '../actions/steps';
import { getFirstThreeValidItems } from '../utils/common';

@translate('selectStep')
class PersonSelectStepScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.dispatch(getStepSuggestions());
  }

  insertName(steps) {
    return steps.map((step) => {
      step.body = step.body.replace('<<name>>', this.props.contactName ? this.props.contactName : this.props.personFirstName);
      return step;
    });
  }

  handleNavigate = () => {
    this.props.onSaveNewSteps();
  }

  render() {
    const name = this.props.contactName ? this.props.contactName : this.props.personFirstName;

    return (
      <SelectStepScreen
        steps={this.insertName(this.props.steps)}
        receiverId={this.props.contactId ? this.props.contactId : this.props.personId}
        useOthersSteps={true}
        headerText={this.props.t('personHeader', { name })}
        contact={this.props.contact ? this.props.contact : null}
        onComplete={this.handleNavigate}
      />
    );
  }

}


PersonSelectStepScreen.propTypes = {
  contactName: PropTypes.string,
  contactId: PropTypes.string,
  contact: PropTypes.object,
  onSaveNewSteps: PropTypes.func,
};

const mapStateToProps = ({ steps, personProfile }, { navigation } ) => ({
  ...(navigation.state.params || {}),
  steps: getFirstThreeValidItems(steps.suggestedForOthers),
  personFirstName: personProfile.personFirstName,
  personId: personProfile.id,
});


export default connect(mapStateToProps)(PersonSelectStepScreen);
export const PERSON_SELECT_STEP_SCREEN = 'nav/PERSON_SELECT_STEP';