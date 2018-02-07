import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { getStepSuggestions } from '../actions/steps';
import SelectStepScreen from './SelectStepScreen';
import { getFirstThreeValidItems } from '../utils/common';

@translate('selectStep')
class SelectMyStepScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.dispatch(getStepSuggestions());
  }

  handleNavigate = () => {
    this.props.onSaveNewSteps();
  }

  render() {
    const { t, enableButton } = this.props;

    return (
      <SelectStepScreen
        steps={this.props.steps}
        receiverId={this.props.personId}
        useOthersSteps={false}
        onComplete={this.handleNavigate}
        headerText={t('meHeader')}
        enableButton={enableButton}
      />
    );
  }

}

const mapStateToProps = ({ steps, auth }, { navigation } ) => ({
  ...(navigation.state.params || {}),
  steps: getFirstThreeValidItems(steps.suggestedForMe),
  personId: auth.personId,
});

export default connect(mapStateToProps)(SelectMyStepScreen);
