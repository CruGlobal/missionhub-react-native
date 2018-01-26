import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SelectStepScreen from './SelectStepScreen';
import { getStepSuggestions } from '../actions/steps';
import { getFirstThreeValidItems } from '../utils/common';

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
    if (this.props.onSaveNewSteps) {
      this.props.onSaveNewSteps();
    } else {
      this.props.onComplete();
    }
  }

  render() {
    const text = `What will you do to help ${this.props.contactName ? this.props.contactName : this.props.personFirstName} experience God?`;

    return (
      <SelectStepScreen
        steps={this.insertName(this.props.steps)}
        receiverId={this.props.contactId ? this.props.contactId : this.props.personId}
        useOthersSteps={true}
        headerText={text}
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
  onComplete: PropTypes.func,
};

const mapStateToProps = ({ steps, personProfile }, { navigation } ) => ({
  ...(navigation.state.params || {}),
  steps: getFirstThreeValidItems(steps.suggestedForOthers),
  personFirstName: personProfile.personFirstName,
  personId: personProfile.id,
});


export default connect(mapStateToProps)(PersonSelectStepScreen);
