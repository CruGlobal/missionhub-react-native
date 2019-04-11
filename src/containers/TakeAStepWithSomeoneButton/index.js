import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { ADD_SOMEONE_SCREEN } from '../AddSomeoneScreen';
import BottomButton from '../../components/BottomButton';
import { navigatePush } from '../../actions/navigation';

@withTranslation()
class TakeAStepWithSomeoneButton extends Component {
  navigateToAddSomeoneScreen = () =>
    this.props.dispatch(navigatePush(ADD_SOMEONE_SCREEN));

  render() {
    const { t } = this.props;

    return (
      <BottomButton
        text={t('mainTabs:takeAStepWithSomeone')}
        onPress={this.navigateToAddSomeoneScreen}
      />
    );
  }
}

export default connect()(TakeAStepWithSomeoneButton);
