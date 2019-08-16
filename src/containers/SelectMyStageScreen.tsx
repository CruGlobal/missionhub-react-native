import React from 'react';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { useNavigationState } from 'react-navigation-hooks';

import { selectMyStage } from '../actions/selectStage';
import { Stage } from '../reducers/stages';
import { AuthState } from '../reducers/auth';
import { ProfileState } from '../reducers/profile';
import { SELF_VIEWED_STAGE_CHANGED } from '../constants';

import PathwayStageScreen from './PathwayStageScreen';

interface SelectMyStageScreenProps {
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
  next: (props?: {
    stage: Stage;
    contactId: string;
    orgId?: string;
    isAlreadySelected: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) => ThunkAction<void, any, {}, never>; // TODO: make next required when only used in flows
  firstName: string;
  contactId: string;
}

interface SelectMyStageNavParams {
  orgId?: string;
  questionText?: string;
  firstItem?: number;
  section: string;
  subsection: string;
  enableBackButton: boolean;
}

const SelectMyStageScreen = ({
  dispatch,
  next,
  firstName,
  contactId,
}: SelectMyStageScreenProps) => {
  const {
    orgId,
    questionText,
    firstItem,
    section,
    subsection,
    enableBackButton = true,
  } = useNavigationState().params as SelectMyStageNavParams;
  const { t } = useTranslation('selectStage');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleScrollToStage = (trackingObj: any) => {
    dispatch({
      type: SELF_VIEWED_STAGE_CHANGED,
      newActiveTab: trackingObj,
    });
  };

  const handleSelectStage = async (stage: Stage, isAlreadySelected = false) => {
    !isAlreadySelected && (await dispatch(selectMyStage(stage.id)));

    dispatch(next({ stage, contactId, orgId, isAlreadySelected }));
  };

  return (
    <PathwayStageScreen
      testID={'stageScreen'}
      buttonText={t('iAmHere').toUpperCase()}
      activeButtonText={t('stillHere').toUpperCase()}
      questionText={questionText || t('meQuestion', { name: firstName })}
      onSelect={handleSelectStage}
      onScrollToStage={handleScrollToStage}
      selectedStageId={firstItem}
      section={section}
      subsection={subsection}
      enableBackButton={enableBackButton}
      isSelf={true}
    />
  );
};

const mapStateToProps = ({
  auth,
  profile,
}: {
  auth: AuthState;
  profile: ProfileState;
}) => ({
  firstName: profile.firstName,
  contactId: auth.person.id,
});

export default connect(mapStateToProps)(SelectMyStageScreen);
export const SELECT_MY_STAGE_SCREEN = 'nav/SELECT_MY_STAGE';
