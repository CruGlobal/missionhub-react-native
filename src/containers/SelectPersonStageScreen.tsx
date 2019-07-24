import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { selectPersonStage, updateUserStage } from '../actions/selectStage';
import { PERSON_VIEWED_STAGE_CHANGED } from '../constants';

import PathwayStageScreen from './PathwayStageScreen';

interface SelectPersonStageScreenProps {
  dispatch: ThunkDispatch<any, null, never>;
  next: (props?: {
    stage: any;
    firstName: string;
    contactId: string;
    contactAssignmentId: string;
    orgId?: string;
    isAlreadySelected: bool;
  }) => ThunkAction<void, any, null, never>; // TODO: make next required when only used in flows
  contactId: string;
  contactAssignmentId: string;
  firstName: string;
  myId: string;
  orgId?: string;
  questionText?: string;
  firstItem?: number;
  section: string;
  subsection: string;
  enableBackButton?: bool;
}

const SelectPersonStageScreen = ({
  dispatch,
  next,
  contactId,
  contactAssignmentId,
  firstName,
  myId,
  orgId,
  questionText,
  firstItem = 0,
  section,
  subsection,
  enableBackButton = true,
}: SelectPersonStageScreenProps) => {
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
          contactId,
          contactAssignmentId,
          firstName,
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
  contactId: contactId || personProfile.id,
  contactAssignmentId: contactAssignmentId || personProfile.contactAssignmentId,
  firstName: firstName || personProfile.personFirstName,
  myId: auth.person.id,
});

export default connect(mapStateToProps)(SelectPersonStageScreen);
export const SELECT_PERSON_STAGE_SCREEN = 'nav/SELECT_PERSON_STAGE';
