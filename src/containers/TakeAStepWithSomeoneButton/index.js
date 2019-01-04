import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import { Button } from '../../components/common';

@translate()
class TakeAStepWithSomeoneButton extends Component {
  render() {
    const { t, hasNotCreatedStep } = this.props;

    return (
      hasNotCreatedStep && (
        <Button
          type="secondary"
          text={t('mainTabs:takeAStepWithSomeone').toUpperCase()}
        />
      )
    );
  }
}

const mapStateToProps = ({ personProfile }) => ({
  hasNotCreatedStep: personProfile.hasNotCreatedStep,
});
export default connect(mapStateToProps)(TakeAStepWithSomeoneButton);
