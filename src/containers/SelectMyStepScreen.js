import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { navigatePush } from '../actions/navigation';
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
    this.props.dispatch(navigatePush('AddSomeone'));
  }

  render() {
    const { t } = this.props;

    return (
      <SelectStepScreen
        steps={this.props.steps}
        receiverId={this.props.personId}
        useOthersSteps={false}
        onComplete={this.handleNavigate}
        headerText={t('meHeader')}
      />
    );
  }

}

const mapStateToProps = ({ steps, auth }) => ({
  steps: getFirstThreeValidItems(steps.suggestedForMe),
  personId: auth.personId,
});

export default connect(mapStateToProps)(SelectMyStepScreen);
