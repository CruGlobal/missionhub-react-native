import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { navigateBack, navigatePush } from '../actions/navigation';
import { selectMyStage } from '../actions/selectStage';
import { SELF_VIEWED_STAGE_CHANGED } from '../constants';

import PathwayStageScreen from './PathwayStageScreen';
import { STAGE_SUCCESS_SCREEN } from './StageSuccessScreen';
import { SELECT_MY_STEP_SCREEN } from './SelectMyStepScreen';

interface selectMyStageScreenProps {
  dispatch: ThunkDispatch<any, null, never>;
  next: (props?: {
    stage: any;
    contactId: string;
    orgId?: string;
    isAlreadySelected: bool;
  }) => ThunkAction<void, any, null, never>; // TODO: make next required when only used in flows
  orgId?: string;
  questionText?: string;
  firstItem?: number;
  section: string;
  subsection: string;
  enableBackButton?: bool;
  firstName: string;
  contactId: string;
}

const SelectMyStageScreen = ({
  dispatch,
  next,
  orgId,
  questionText,
  firstItem = 0,
  section,
  subsection,
  enableBackButton = false,
  firstName,
  contactId,
}: selectMyStageScreenProps) => {
  const { t } = useTranslation('selectStage');

  const handleScrollToStage = trackingObj => {
    dispatch({
      type: SELF_VIEWED_STAGE_CHANGED,
      newActiveTab: trackingObj,
    });
  };

  const handleSelectStage = async (stage, isAlreadySelected = false) => {
    !isAlreadySelected && (await dispatch(selectMyStage(stage.id)));

    dispatch(next({ stage, contactId, orgId, isAlreadySelected }));
  };

  return (
    <PathwayStageScreen
      buttonText={t('iAmHere').toUpperCase()}
      activeButtonText={t('stillHere').toUpperCase()}
      questionText={questionText || t('meQuestion', { name: firstName })}
      onSelect={handleSelectStage}
      onScrollToStage={handleScrollToStage}
      firstItem={firstItem}
      section={section}
      subsection={subsection}
      enableBackButton={enableBackButton}
      isSelf={true}
    />
  );
};

const mapStateToProps = (
  { auth, profile },
  {
    navigation: {
      state: {
        params: {
          orgId,
          questionText,
          firstItem,
          section,
          subsection,
          enableBackButton,
        },
      },
    },
    next,
  },
) => ({
  next,
  orgId,
  questionText,
  firstItem,
  section,
  subsection,
  enableBackButton,
  firstName: profile.firstName,
  contactId: auth.person.id,
});

export default connect(mapStateToProps)(StageScreen);
export const SELECT_MY_STAGE_SCREEN = 'nav/SELECT_MY_STAGE';
