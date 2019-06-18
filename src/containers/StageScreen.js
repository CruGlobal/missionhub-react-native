import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { selectMyStage } from '../actions/selectStage';
import { SELF_VIEWED_STAGE_CHANGED } from '../constants';

import PathwayStageScreen from './PathwayStageScreen';

@withTranslation('selectStage')
class StageScreen extends Component {
  onScrollToStage = trackingObj => {
    this.props.dispatch({
      type: SELF_VIEWED_STAGE_CHANGED,
      newActiveTab: trackingObj,
    });
  };

  handleSelectStage = async (stage, isAlreadySelected) => {
    const { dispatch, next, contactId, orgId } = this.props;

    if (!isAlreadySelected) {
      await dispatch(selectMyStage(stage.id));
    }

    dispatch(next({ stage, contactId, orgId, isAlreadySelected }));
  };

  render() {
    const {
      t,
      enableBackButton,
      firstName,
      firstItem,
      questionText,
      section,
      subsection,
    } = this.props;

    return (
      <PathwayStageScreen
        buttonText={t('iAmHere').toUpperCase()}
        activeButtonText={t('stillHere').toUpperCase()}
        questionText={questionText || t('meQuestion', { name: firstName })}
        onSelect={this.handleSelectStage}
        onScrollToStage={this.onScrollToStage}
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
  next: PropTypes.func.isRequired,
  contactId: PropTypes.string,
  orgId: PropTypes.string,
  questionText: PropTypes.string,
  firstItem: PropTypes.number,
  section: PropTypes.string,
  subsection: PropTypes.string,
  enableBackButton: PropTypes.bool,
};

const mapStateToProps = (
  { profile },
  {
    navigation: {
      state: {
        params: {
          contactId,
          orgId,
          questionText,
          firstItem,
          section,
          subsection,
          enableBackButton,
        },
      },
      next,
    },
  },
) => ({
  contactId,
  orgId,
  questionText,
  firstItem,
  section,
  subsection,
  enableBackButton,
  next,
  firstName: profile.firstName,
});

export default connect(mapStateToProps)(StageScreen);
export const STAGE_SCREEN = 'nav/STAGE';
