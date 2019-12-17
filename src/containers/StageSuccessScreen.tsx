import React from 'react';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';

import { navigateBack } from '../actions/navigation';
import { AuthState } from '../reducers/auth';
import { Stage, StagesState } from '../reducers/stages';
import { stageSelector, localizedStageSelector } from '../selectors/stages';

import IconMessageScreen from './IconMessageScreen';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DispatchType = ThunkDispatch<any, null, never>;
type SelectedStage = { self_followup_description?: string } | undefined;

interface StageSuccessScreenProps {
  dispatch: DispatchType;
  next: (props?: {
    selectedStage: SelectedStage;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) => ThunkAction<void, any, null, never>; // TODO: make next
  firstName?: string;
  stage?: Stage;
}

const StageSuccessScreen = ({
  dispatch,
  next,
  firstName,
  stage,
}: StageSuccessScreenProps) => {
  const { t } = useTranslation('stageSuccess');

  const handleNavigateToStep = () => dispatch(next());
  const back = () => dispatch(navigateBack());

  // Build out message
  let message =
    localizedStageSelector(stage, i18next.language).self_followup_description ||
    t('backupMessage');
  message = message.replace('<<user>>', firstName ? firstName : t('friend'));

  return (
    <IconMessageScreen
      testID="IconMessageScreen"
      mainText={message}
      buttonText={t('chooseSteps')}
      screenNameFragments={['onboarding', 'stage confirmation']}
      onComplete={handleNavigateToStep}
      iconPath={require('../../assets/images/pathFinder.png')}
      onBack={back}
    />
  );
};

const mapStateToProps = ({
  auth,
  stages,
}: {
  auth: AuthState;
  stages: StagesState;
}) => ({
  firstName: auth.person.first_name,
  stage: stageSelector(
    { stages },
    { stageId: auth.person.user.pathway_stage_id },
  ),
});
export default connect(mapStateToProps)(StageSuccessScreen);
export const STAGE_SUCCESS_SCREEN = 'nav/STAGE_SUCCESS';
