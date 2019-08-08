import React from 'react';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { useNavigationState } from 'react-navigation-hooks';

import { selectPersonStage, updateUserStage } from '../actions/selectStage';
import { AuthState } from '../reducers/auth';
import { Stage } from '../reducers/stages';
import { PersonProfileState } from '../reducers/personProfile';
import { PERSON_VIEWED_STAGE_CHANGED } from '../constants';

import PathwayStageScreen from './PathwayStageScreen';

interface SelectPersonStageScreenProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
  next: (props?: {
    stage: Stage;
    firstName: string;
    contactId: string;
    contactAssignmentId: string;
    orgId?: string;
    isAlreadySelected: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) => ThunkAction<void, any, {}, never>; // TODO: make next required when only used in flows
  contactId: string;
  contactAssignmentId: string;
  firstName: string;
  myId: string;
}

interface SelectPersonStageNavParams {
  orgId?: string;
  questionText?: string;
  firstItem?: number;
  section: string;
  subsection: string;
  enableBackButton: boolean;
}

const SelectPersonStageScreen = ({
  dispatch,
  next,
  contactId,
  contactAssignmentId,
  firstName,
  myId,
}: SelectPersonStageScreenProps) => {
  const {
    orgId,
    questionText,
    firstItem,
    section,
    subsection,
    enableBackButton = true,
  } = useNavigationState().params as SelectPersonStageNavParams;
  const { t } = useTranslation('selectStage');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleScrollToStage = (trackingObj: any) => {
    dispatch({
      type: PERSON_VIEWED_STAGE_CHANGED,
      newActiveTab: trackingObj,
    });
  };

  const handleSelectStage = async (
    stage: Stage,
    isAlreadySelected: boolean = false,
  ) => {
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
      testID={'stageScreen'}
      buttonText={t('iAmHere').toUpperCase()}
      activeButtonText={t('stillHere').toUpperCase()}
      questionText={questionText || t('personQuestion', { name: firstName })}
      onSelect={handleSelectStage}
      onScrollToStage={handleScrollToStage}
      selectedStageId={firstItem}
      section={section}
      subsection={subsection}
      enableBackButton={enableBackButton}
      isSelf={false}
    />
  );
};

const mapStateToProps = (
  {
    auth,
    personProfile,
  }: {
    auth: AuthState;
    personProfile: PersonProfileState;
  },
  {
    navigation: {
      state: {
        params: { contactId, contactAssignmentId, firstName },
      },
    },
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
) => ({
  contactId: contactId || personProfile.id,
  contactAssignmentId: contactAssignmentId || personProfile.contactAssignmentId,
  firstName: firstName || personProfile.personFirstName,
  myId: auth.person.id,
});

export default connect(mapStateToProps)(SelectPersonStageScreen);
export const SELECT_PERSON_STAGE_SCREEN = 'nav/SELECT_PERSON_STAGE';
