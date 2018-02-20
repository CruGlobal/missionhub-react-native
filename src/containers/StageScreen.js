import React, { Component } from 'react';
import { connect } from 'react-redux';
import { navigatePush, navigateBack } from '../actions/navigation';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import PathwayStageScreen from './PathwayStageScreen';
import { selectStage } from '../actions/selectStage';
import { STAGE_SUCCESS_SCREEN } from './StageSuccessScreen';

@translate('selectStage')
class StageScreen extends Component {
  constructor(props) {
    super(props);

    this.handleSelectStage = this.handleSelectStage.bind(this);
  }

  complete(stage) {
    if (this.props.onComplete) {
      this.props.onComplete(stage);
      if (!this.props.noNav) {
        this.props.dispatch(navigateBack());
      }
    } else {
      this.props.dispatch(navigatePush(STAGE_SUCCESS_SCREEN, { selectedStage: stage }));
    }
  }

  handleSelectStage(stage, isAlreadySelected) {
    if (isAlreadySelected) {
      this.complete(stage);
    } else {
      this.props.dispatch(selectStage(stage.id)).then(() => {
        this.complete(stage);
      });
    }
  }

  render() {
    const { t, enableBackButton, firstName, firstItem, questionText, section, subsection } = this.props;
    const name = firstName;

    return (
      <PathwayStageScreen
        buttonText={t('iAmHere').toUpperCase()}
        activeButtonText={t('stillHere').toUpperCase()}
        questionText={questionText || t('meQuestion', { name })}
        onSelect={this.handleSelectStage}
        section={section}
        firstItem={firstItem}
        subsection={subsection}
        enableBackButton={enableBackButton}
        isSelf
      />
    );
  }

}

StageScreen.propTypes = {
  onComplete: PropTypes.func,
  contactId: PropTypes.string,
  questionText: PropTypes.string,
  firstItem: PropTypes.number,
  section: PropTypes.string,
  subsection: PropTypes.string,
  enableBackButton: PropTypes.bool,
  noNav: PropTypes.bool,
};

const mapStateToProps = ({ profile }, { navigation } ) => ({
  ...(navigation.state.params || {}),
  firstName: profile.firstName,
});

export default connect(mapStateToProps)(StageScreen);
export const STAGE_SCREEN = 'nav/STAGE';
export const STAGE_ONBOARDING_SCREEN = 'nav/STAGE_ONBOARDING';
