import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { selectPersonStage, updateUserStage } from '../actions/selectStage';
import { showReminderOnLoad } from '../actions/notifications';
import { navigateBack, navigatePush } from '../actions/navigation';
import { buildTrackingObj } from '../utils/common';
import { trackActionWithoutData } from '../actions/analytics';
import {
  ACTIONS,
  PERSON_VIEWED_STAGE_CHANGED,
  NOTIFICATION_PROMPT_TYPES,
} from '../constants';
import { completeOnboarding } from '../actions/onboardingProfile';

import { PERSON_SELECT_STEP_SCREEN } from './PersonSelectStepScreen';
import { CELEBRATION_SCREEN } from './CelebrationScreen';
import PathwayStageScreen from './PathwayStageScreen';

const SelectPersonStageScreen = ({
  dispatch,
  next,
  orgId,
  questionText,
  firstItem = 0,
  section,
  subsection,
  enableBackButton = true,
  firstName,
  contactId,
}: selectPersonStageScreenProps) => {
  const { t } = useTranslation('selectStage');

  const handleScrollToStage = trackingObj => {
    dispatch({
      type: PERSON_VIEWED_STAGE_CHANGED,
      newActiveTab: trackingObj,
    });
  };

  const handleSelectStage = async (stage, isAlreadySelected = false) => {
    !isAlreadySelected &&
      (await dispatch(
        contactAssignmentId
          ? updateUserStage(contactAssignmentId, stage.id)
          : selectPersonStage(contactId, myId, stage.id, orgId),
      ));

    dispatch(
      next({
        stage,
        firstName,
        contactId,
        contactAssignmentId,
        orgId,
        isAlreadySelected,
      }),
    );
  };

  return (
    <PathwayStageScreen
      buttonText={t('iAmHere').toUpperCase()}
      activeButtonText={t('stillHere').toUpperCase()}
      questionText={questionText || t('personQuestion', { name: firstName })}
      onSelect={handleSelectStage}
      onScrollToStage={handleScrollToStage}
      firstItem={firstItem}
      section={section}
      subsection={subsection}
      enableBackButton={enableBackButton}
      isSelf={false}
    />
  );
};

const mapStateToProps = (
  { personProfile, auth },
  {
    navigation: {
      state: {
        params: {
          name,
          contactId,
          contactAssignmentId,
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
  name,
  contactId,
  contactAssignmentId,
  orgId,
  questionText,
  firstItem,
  section,
  subsection,
  enableBackButton,
  personFirstName: personProfile.personFirstName,
  personId: personProfile.id,
  contactAssignmentId: onComplete // onComplete currently seems to be used as a flag to indicate if we are in onboarding or not
    ? contactAssignmentId
    : contactAssignmentId || personProfile.contactAssignmentId,
  myId: auth.person.id,
});

export default connect(mapStateToProps)(PersonStageScreen);
export const SELECT_PERSON_STAGE_SCREEN = 'nav/SELECT_PERSON_STAGE';
