import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import SelectStepScreen from './SelectStepScreen';
import { getStepSuggestions } from '../actions/steps';
import { isAndroid, getFirstThreeValidItems } from '../utils/common';

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

  render() {
    const { t } = this.props;

    const name = this.props.contactName ? this.props.contactName : this.props.personFirstName;
    let nextScreen = 'MainTabs';

    // Android doesn't need a primer for notifications the way iOS does
    if (!isAndroid && !this.props.hasAskedPushNotifications) {
      nextScreen = 'NotificationPrimer';
    }

    return (
      <SelectStepScreen
        steps={this.insertName(this.props.steps)}
        receiverId={this.props.contactId ? this.props.contactId : this.props.personId}
        useOthersSteps={true}
        nextScreen={this.props.contact ? null : nextScreen}
        headerText={t('personHeader', { name })}
        contact={this.props.contact ? this.props.contact : null}
      />
    );
  }

}

const mapStateToProps = ({ steps, personProfile }, { navigation } ) => ({
  ...(navigation.state.params || {}),
  steps: getFirstThreeValidItems(steps.suggestedForOthers),
  personFirstName: personProfile.personFirstName,
  personId: personProfile.id,
});


PersonSelectStepScreen.propTypes = {
  contactName: PropTypes.string,
  contactId: PropTypes.string,
  contact: PropTypes.object,
};


export default connect(mapStateToProps)(PersonSelectStepScreen);
