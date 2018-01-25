import React, { Component } from 'react';
import { connect } from 'react-redux';
import { navigatePush, navigateBack } from '../actions/navigation';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import PathwayStageScreen from './PathwayStageScreen/index';
import { selectStage } from '../actions/selectStage';

@translate('selectStage')
class StageScreen extends Component {
  constructor(props) {
    super(props);

    this.handleSelectStage = this.handleSelectStage.bind(this);
  }

  handleSelectStage(stage) {
    this.props.dispatch(selectStage(stage.id)).then(() => {
      if (this.props.onComplete) {
        this.props.onComplete(stage);
        this.props.dispatch(navigateBack());
      } else {
        this.props.dispatch(navigatePush('StageSuccess', { selectedStage: stage }));
      }
    });
  }

  render() {
    const { t } = this.props;
    const name = this.props.firstName;

    return (
      <PathwayStageScreen
        buttonText={t('iAmHere').toUpperCase()}
        questionText={t('meQuestion', name)}
        onSelect={this.handleSelectStage}
      />
    );
  }

}

StageScreen.propTypes = {
  onComplete: PropTypes.func,
  contactId: PropTypes.string,
  currentStage: PropTypes.string,
};

const mapStateToProps = ({ profile }, { navigation } ) => ({
  ...(navigation.state.params || {}),
  firstName: profile.firstName,
});

export default connect(mapStateToProps)(StageScreen);
