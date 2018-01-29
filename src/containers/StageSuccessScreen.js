import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { connect } from 'react-redux';
import IconMessageScreen from './IconMessageScreen/index';

@translate('stageSuccess')
class StageSuccessScreen extends Component {
  constructor(props) {
    super(props);
  }

  getMessage() {
    const { t, selectedStage } = this.props;

    let followUpText = t(`stages.${selectedStage.name.toLowerCase()}.followup`);

    //let followUpText = this.props.selectedStage && this.props.selectedStage.self_followup_description ? this.props.selectedStage.self_followup_description : t('backupMessage');
    //followUpText = followUpText.replace('<<user>>', this.props.firstName ? this.props.firstName : t('friend'));
    return followUpText;
  }

  render() {
    const { t } = this.props;
    const message = this.getMessage();
    return <IconMessageScreen
      mainText={message}
      buttonText={t('chooseSteps').toUpperCase()}
      nextScreen="Step"
      iconPath={require('../../assets/images/pathFinder.png')} />;
  }
}

StageSuccessScreen.propTypes = {
  selectedStage: PropTypes.object.isRequired,
};


const mapStateToProps = ({ profile }, { navigation }) => ({
  ...(navigation.state.params || {}),
  firstName: profile.firstName,
});

export default connect(mapStateToProps)(StageSuccessScreen);
