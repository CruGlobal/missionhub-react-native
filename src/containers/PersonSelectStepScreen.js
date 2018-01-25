import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { navigatePush } from '../actions/navigation';
import SelectStepScreen from './SelectStepScreen';
import { getStepSuggestions } from '../actions/steps';
import { isAndroid, getFirstThreeValidItems } from '../utils/common';

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
      let nextScreen = 'MainTabs';
      // Android doesn't need a primer for notifications the way iOS does
      if (!isAndroid && !this.props.hasAskedPushNotifications) {
        nextScreen = 'NotificationPrimer';
      }
      this.props.dispatch(navigatePush(nextScreen));
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
};

const mapStateToProps = ({ steps, personProfile }, { navigation } ) => ({
  ...(navigation.state.params || {}),
  steps: getFirstThreeValidItems(steps.suggestedForOthers),
  personFirstName: personProfile.personFirstName,
  personId: personProfile.id,
});


export default connect(mapStateToProps)(PersonSelectStepScreen);
